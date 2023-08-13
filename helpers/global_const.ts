require("dotenv").config();

export const BINANCE_URL_DOMAIN: string =
  process.env.NEXT_PUBLIC_URL_BASE_PROJECT || "https://testnet.binance.vision";
