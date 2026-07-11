import 'dotenv/config'

import { PrismaClient } from "@prisma/client";
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

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

afterAll(async () => {

  const pool = new Pool({ connectionString: databaseURL })
  const adapter = new PrismaPg(pool, { schema: schemaId })
  
  // Passamos o adapter para o PrismaClient, resolvendo o erro de validação!
  const prisma = new PrismaClient({ adapter })

  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})