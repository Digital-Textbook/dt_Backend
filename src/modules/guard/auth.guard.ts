import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AdminJwtGuard } from 'src/modules/auth/guard/AdminAuthGuard';
import { RolesGuard } from 'src/modules/guard/role.guard';
import { PermissionsGuard } from 'src/modules/guard/permission.guard';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly adminJwtGuard: AdminJwtGuard,
    private readonly rolesGuard: RolesGuard,
    private readonly permissionsGuard: PermissionsGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isJwtValid = await this.adminJwtGuard.canActivate(context);
    if (!isJwtValid) return false;

    const isRoleValid = await this.rolesGuard.canActivate(context);
    if (!isRoleValid) return false;

    const isPermissionValid = await this.permissionsGuard.canActivate(context);
    return isPermissionValid;
  }
}
