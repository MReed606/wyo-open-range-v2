export const ADMIN_EMAILS = [
  "mathewrreed88@gmail.com",
  "vince.green.4@outlook.com",
];

export function isAdminEmail(
  email?: string | null
) {

  if (!email) return false;

  return ADMIN_EMAILS.includes(
    email.toLowerCase()
  );
}
