import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { RolesGuard } from 'src/modules/guard/role.guard';
import { PermissionsGuard } from 'src/modules/guard/permission.guard';
import { AdminJwtGuard } from './AdminAuthGuard';

@Injectable()
export class Auth implements CanActivate {
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
