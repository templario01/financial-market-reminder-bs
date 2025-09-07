import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionData } from '../types/types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): SessionData => {
    const ctx = context.switchToHttp().getRequest();
    return ctx.user;
  },
);
