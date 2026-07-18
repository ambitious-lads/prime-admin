export const site = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Prime UAT",
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://primely-api.onrender.com/api/v1",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "@PrimeUAT",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "@PrimeUAT",
  supportTelegram:
    process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM ?? "@PrimeUAT",
  supportTelegramUrl:
    process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM_URL ?? "https://t.me/PrimeUAT",
  paymentAccounts: [
    {
      method: "Telebirr",
      account: process.env.NEXT_PUBLIC_TELEBIRR_ACCOUNT ?? "0969617341",
      name: process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NAME ?? "Yordanos Bogale Sime",
    },
    {
      method: "CBE",
      account: process.env.NEXT_PUBLIC_CBE_ACCOUNT ?? "1000540521399",
      name: process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NAME ?? "Yordanos Bogale Sime",
    },
  ],
  paymentAccount:
    process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT ??
    "Telebirr · 0969617341 · Yordanos Bogale Sime / CBE · 1000540521399 · Yordanos Bogale Sime",
  description: "Ace your exams. Study smarter with Prime UAT.",
};
