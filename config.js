require('dotenv').config();

const { JWT_SECRET = 'dev-secret', MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

module.exports = {
  JWT_SECRET,
  MONGO_URL,
};
