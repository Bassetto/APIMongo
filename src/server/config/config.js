import * as dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();

const {
  PORT,
  HOST,
  HOST_URL,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;

assert(PORT, 'PORT is required');
assert(HOST, 'HOST is required');

export default {
  port: PORT,
  host: HOST,
  hostUrl: HOST_URL,
  mongodbConfig: {
      dbHost: DB_HOST,
      dbPort: DB_PORT,
      dbName: DB_NAME,
    },
};
