import { SetMetadata } from "@nestjs/common";

export const ALLOW_ANONYMOUS_KEY = 'ALLOW_ANONYMOUS';

/**
 * Use with AuthGuard to allow unauthenticated user to access API
 */
export const AllowAnonymous = () => SetMetadata(ALLOW_ANONYMOUS_KEY, true);