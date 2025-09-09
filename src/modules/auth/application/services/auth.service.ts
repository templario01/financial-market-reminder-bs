import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { AccessTokenEntity } from '../../domain/entities/access-token.entity';
import { AuthConfig } from '../../../../core/settings/settings.model';
import { plainToInstance } from 'class-transformer';
import { obfuscateEmail } from '../../../../core/common/utils/obfuscate';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async encryptPassword(pass: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(pass, salt);
  }

  public comparePasswords(
    password: string,
    savedPassword: string,
  ): Promise<boolean> {
    return compare(password, savedPassword);
  }

  public async createAccessToken(
    payload: Record<string, any>,
  ): Promise<AccessTokenEntity> {
    const { expiresIn } = this.configService.get<AuthConfig>('auth')!;
    const accessToken = await this.jwtService.signAsync(payload, {
      algorithm: 'HS256',
    });

    this.logger.log(
      `New session for accountId=${payload.sub} with email ${obfuscateEmail(payload.username)}`,
    );

    return plainToInstance(AccessTokenEntity, {
      token: accessToken,
      tokenType: 'Bearer',
      expiresIn,
    } as AccessTokenEntity);
  }
}
