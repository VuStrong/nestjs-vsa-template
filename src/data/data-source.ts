// This file only for migrations, don't import it

import path from 'path';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const dataSource = new DataSource({
    type: 'mysql',
    url: process.env.DATABASE_URL ?? '',
    synchronize: false,
    entities: [path.join(__dirname, 'entities/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
});
