export interface AdminJwtPayload {
  email?: string;
  role?: string;
  permissions?: string[];
  exp?: number;
  iat?: number;
}
