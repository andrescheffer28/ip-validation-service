import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
  IPLOCATE_API_KEY: z.string(),
})

export type Env = z.infer<typeof envSchema>
