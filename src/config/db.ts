import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// 1. Initialize environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL environment variable is missing!');
}

// 2. Instantiate a native PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 3. Bind the pool to the Prisma 7 Driver Adapter layer
const adapter = new PrismaPg(pool);

// 4. Pass the adapter to the constructor to fulfill Prisma 7 specifications
export const prisma = new PrismaClient({ adapter });