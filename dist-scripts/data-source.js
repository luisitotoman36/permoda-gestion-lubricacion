"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const useSqlite = process.env.USE_SQLITE === 'true' || !process.env.DATABASE_HOST;
exports.AppDataSource = new typeorm_1.DataSource(useSqlite
    ? {
        type: 'sqlite',
        database: process.env.SQLITE_DATABASE || path_1.default.join(__dirname, '..', 'data', 'dev.sqlite'),
        synchronize: true,
        logging: false,
        entities: [__dirname + '/entity/*.{ts,js}'],
    }
    : {
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: Number(process.env.DATABASE_PORT || 5432),
        username: process.env.DATABASE_USER || 'permoda',
        password: process.env.DATABASE_PASSWORD || 'permoda_pass',
        database: process.env.DATABASE_NAME || 'permoda_db',
        synchronize: true,
        logging: false,
        entities: [__dirname + '/entity/*.{ts,js}'],
    });
