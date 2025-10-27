import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

/**
 * Use with RolesGuard to specify required roles for an API
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
