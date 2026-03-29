import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolMaxEnv = process.env.DATABASE_POOL_SIZE;
const parsedPoolMax = Number.parseInt(poolMaxEnv ?? '10', 10);
const poolMax = Number.isNaN(parsedPoolMax) ? 10 : parsedPoolMax;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: poolMax,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export const getClient = async () => {
  return pool.connect();
};

export default pool;
