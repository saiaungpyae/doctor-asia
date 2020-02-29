import {
  postVersion,
  getVersionDetail
} from '../controllers/version.controller';

export default app => {
  app.get('/', (req, res) => {
    res.json({ message: 'https://github.com/saiaungpyae/doctor-asia' });
  });
  app.post('/object', postVersion);
  app.get('/object/:key', getVersionDetail);
};
