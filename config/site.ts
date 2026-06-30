export const site = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Prime UAT",
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://primely-api.onrender.com/api",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "0994627985",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "primeuat.support@gmail.com",
  paymentAccount:
    process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT ??
    "Commercial Bank of Ethiopia (CBE) · 1000123456789 · Prime UAT",
  description: "Ace your exams. Study smarter with Prime UAT.",
};
