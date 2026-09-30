// src/lib/pep.ts
import Client from "@kav3/pep";

// کلاینت رو یه بار بساز (singleton)
// username و password رو از my.pep.co.ir بگیر (اگه نداری، تیکت بزن)
export const pep = new Client({
  username: process.env.PEP_USERNAME!,
  password: process.env.PEP_PASSWORD!,
  terminal: Number(process.env.PEP_TERMINAL_CODE),
  callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify`,
});