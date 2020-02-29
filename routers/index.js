import {
  postVersion,
  getVersionDetail
} from '../controllers/version.controller';

export default app => {
  app.post('/object', postVersion);
  app.get('/object/:key', getVersionDetail);
};
