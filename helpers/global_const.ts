import dotenv from "dotenv";

dotenv.config();

interface EnvVariables {
  BINANCE_URL_DOMAIN: string;
  BINANCE_API_KEY: string;
  BINANCE_SECRET_KEY: string;
}

export const env: EnvVariables = {
  BINANCE_URL_DOMAIN:
    process.env.BINANCE_URL_DOMAIN || "https://testnet.binance.vision",
  BINANCE_API_KEY: process.env.BINANCE_API_KEY || "",
  BINANCE_SECRET_KEY: process.env.BINANCE_SECRET_KEY || "",
};

if (
  !env.BINANCE_API_KEY ||
  !env.BINANCE_SECRET_KEY ||
  !env.BINANCE_URL_DOMAIN
) {
  throw new Error("Missing required environment variables");
}

export default env;
