export const ADMIN_ROLES = [
  "owner",
  "admin",
  "moderator",
];

export function isAdminRole(
  role?: string
) {

  return ADMIN_ROLES.includes(
    role ?? ""
  );
}
