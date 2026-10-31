export interface AuthTokens {
  token: string;
  refresh_token: string;
}

export type Role = 'ROLE_USER' | 'ROLE_COACH' | 'ROLE_ADMIN';

/** GET /api/me */
export interface CurrentUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  /** AAAA-MM-JJ (ou ISO 8601) */
  birthDate: string | null;
  roles: string[];
  createdAt: string;
}

/** PATCH /api/me */
export interface ProfileUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  birthDate?: string | null;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  /** Acceptation des CGU et de la politique de confidentialité (User.consent) */
  acceptCgu: boolean;
}

export interface MessageResponse {
  message: string;
  code?: string;
}

/** Accès au back-office EasyAdmin : ROLE_COACH minimum */
export function canAccessAdmin(user: Pick<CurrentUser, 'roles'> | null | undefined): boolean {
  return !!user && user.roles.some((r) => r === 'ROLE_COACH' || r === 'ROLE_ADMIN');
}

export function initials(user: Pick<CurrentUser, 'firstName' | 'lastName'>): string {
  return `${user.firstName?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}`.toUpperCase() || '?';
}
