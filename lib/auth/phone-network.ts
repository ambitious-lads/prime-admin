export function isSafaricomEthiopiaPhone(input: string): boolean {
  const phone = input.trim().replace(/[\s()-]/g, "");
  return (
    /^07\d{8}$/.test(phone) ||
    /^7\d{8}$/.test(phone) ||
    /^2517\d{8}$/.test(phone) ||
    /^\+2517\d{8}$/.test(phone)
  );
}
