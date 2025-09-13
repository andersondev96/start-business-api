import "dotenv/config";
import { z } from "zod";

export const envSchema = z.object({
  APP_ENV: z.enum(["development", "production", "test"]).default("development"),
  APP_API_URL: z.string().url(),
  APP_WEB_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  APP_SECRET_TOKEN: z.string(),
  APP_SECRET_REFRESH_TOKEN: z.string(),
  GOOGLE_MAPS_API_KEY: z.string(),
  disk: z.enum(["local", "s3"]).default("local"),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional()
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());
  
  throw new Error("Invalid environment variables");
}

export const env = _env.data;