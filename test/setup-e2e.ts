import 'dotenv/config'

import { PrismaClient } from "@prisma/client";
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const schemaId = randomUUID()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const databaseURL = generateUniqueDatabaseURL(schemaId)
process.env.DATABASE_URL = databaseURL

beforeAll(async () => {
  execSync('npx prisma migrate deploy')
})

console.log('TEST DATABASE_URL:', databaseURL)

afterAll(async () => {
  const pool = new Pool({ connectionString: databaseURL })

  const prisma = new PrismaClient({
    adapter: new PrismaPg(pool, { schema: schemaId }) 
  })

  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})