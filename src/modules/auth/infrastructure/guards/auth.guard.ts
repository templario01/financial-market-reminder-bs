import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../domain/repositories/user-repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getContext(context);
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      const user = await this.userRepository.findUserByEmailIncludingAccount(
        payload.email,
      );
      if (!user || user.account?.isActive === false) {
        throw new Error('Cuenta no verificada o usuario inválido');
      }
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    try {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];

      return type === 'Bearer' ? token : undefined;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private getContext(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
