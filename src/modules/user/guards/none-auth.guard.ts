import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 无守卫访问
 */
@Injectable()
export class NoneAuthGuard extends AuthGuard('none') {
    async canActivate(context: ExecutionContext) {
        return true;
    }
}
