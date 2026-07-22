export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL ?? "http://localhost:3000/api";

export const APP_ENV = process.env.APP_ENV ?? process.env.NODE_ENV ?? "development";

const DEFAULT_STORE_REVALIDATE_SECONDS = APP_ENV === "production" ? 60 * 60 * 24 : 60;

export const STORE_REVALIDATE_SECONDS = process.env.STORE_REVALIDATE_SECONDS
  ? Number(process.env.STORE_REVALIDATE_SECONDS)
  : DEFAULT_STORE_REVALIDATE_SECONDS;
