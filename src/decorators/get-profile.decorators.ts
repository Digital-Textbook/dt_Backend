import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserProfile } from 'src/modules/user/entities/UserProfile.entity';
export const GetProfile = createParamDecorator(
  (_data, ctx: ExecutionContext): UserProfile => {
    const req = ctx.switchToHttp().getRequest();
    return req.userProfile;
  },
);
