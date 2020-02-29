import { createNewVersion, versionDetail } from '../services/version.service';
import HTTPError from '../utils/httpError';

export const postVersion = async (req, res) => {
  const bodyKeys = Object.keys(req.body);

  if (bodyKeys.length !== 1) {
    throw new HTTPError(400, 'Version object should have only one key');
  }

  const key = bodyKeys[0];
  const value = req.body[key];
  const data = await createNewVersion(key, value);
  res.status(200).json(data);
};

export const getVersionDetail = async (req, res) => {
  const { timestamp } = req.query;
  const { key } = req.params;

  const { value } = await versionDetail(key, timestamp);
  res.status(200).json({ value });
};
