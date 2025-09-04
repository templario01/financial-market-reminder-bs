import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OAuth2Client,
  TokenPayload as GoogleTokenPayload,
} from 'google-auth-library';
import { AuthConfig } from '../../../../core/settings/settings.model';
import { NonUndefinedProps } from '../../../../core/common/types/types';

export type TokenPayload = NonUndefinedProps<GoogleTokenPayload, 'email'>;

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);
  private readonly client: OAuth2Client;
  private readonly clientId: string;

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<AuthConfig>('auth')!.google.clientId;
    this.client = new OAuth2Client(this.clientId);
  }

  async verifyIdToken(idToken: string): Promise<TokenPayload> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('User email not found in Google token');
      }
      return payload as TokenPayload;
    } catch (error) {
      this.logger.error('Error verifying Google ID token', error);
      throw new UnauthorizedException('Token de Google inválido');
    }
  }
}
