import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const explicitSqlite = process.env.USE_SQLITE === 'true';
const explicitPostgres = process.env.USE_SQLITE === 'false';
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const hasDatabaseHost = Boolean(process.env.DATABASE_HOST);

const useSqlite = explicitSqlite || (!explicitPostgres && !hasDatabaseUrl && !hasDatabaseHost);

export const AppDataSource = new DataSource(
  useSqlite
    ? {
        type: 'sqlite',
        database: process.env.SQLITE_DATABASE || path.join(__dirname, '..', 'data', 'dev.sqlite'),
        synchronize: true,
        logging: false,
        entities: [__dirname + '/entity/*.{ts,js}'],
      }
    : {
        type: 'postgres',
        url: process.env.DATABASE_URL || undefined,
        host: process.env.DATABASE_HOST || 'localhost',
        port: Number(process.env.DATABASE_PORT || 5432),
        username: process.env.DATABASE_USER || 'permoda',
        password: process.env.DATABASE_PASSWORD || 'permoda_pass',
        database: process.env.DATABASE_NAME || 'permoda_db',
        synchronize: true,
        logging: false,
        entities: [__dirname + '/entity/*.{ts,js}'],
      }
);

