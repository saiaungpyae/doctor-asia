import KeyModel from '../models/key.model';
import ValueModel from '../models/value.model';
import HTTPError from '../utils/httpError';

const isValidKey = key => {
  return /^[a-zA-Z0-9_]*$/.test(key);
};

const checkKeyValid = key => {
  if (!isValidKey(key)) {
    throw new HTTPError(
      400,
      'Please provide valid key. A key can only contain words and numbers'
    );
  }
};

const checkValueValid = value => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new HTTPError(400, 'Value must be string or number');
  }
};

/**
 * Save new value and link with key
 * Returns the created time of new value
 * @param {String} key
 * @param {String} value
 * @returns {Object} timestamp
 */
export const createNewVersion = async (key, value) => {
  checkKeyValid(key);
  checkValueValid(value);
  const newValue = new ValueModel({ value });
  await newValue.save();
  await KeyModel.findOneAndUpdate(
    { key },
    { $push: { values: newValue._id } },
    { upsert: true }
  );

  const timestamp = Date.parse(newValue.createdAt);
  return { key, value, timestamp };
};

/**
 * Returns the value of the key
 * @param {String} key
 * @param {Date} timestamp
 * @returns {String} value
 */
export const versionDetail = async (key, timestamp) => {
  checkKeyValid(key);

  let matchQuery = {};
  if (timestamp) {
    // if timestamp is in milliseconds,
    // convert it to integer and add 1000 ms to ensure millisecond conflict
    // else use date string directly
    const ts = new Date(+timestamp + 1000 || timestamp);
    if (ts.getTime() !== ts.getTime()) {
      throw new HTTPError(400, 'Please provide valid date');
    }
    matchQuery = { createdAt: { $lte: new Date(ts) } };
  }

  const keyObject = await KeyModel.findOne({ key }).populate({
    path: 'values',
    match: matchQuery,
    options: {
      sort: { _id: -1 },
      limit: 1
    },
    select: {
      value: 1
    }
  });

  if (!keyObject) {
    throw new HTTPError(400, 'The key you provided is not found in database');
  }

  const { values } = keyObject;

  if (!values || values.length < 1) {
    throw new HTTPError(
      400,
      'The key you provided does not have any value or there is no any valid value for the timestamp you provided'
    );
  }

  const [valueObject] = values;

  return { value: valueObject.value };
};
