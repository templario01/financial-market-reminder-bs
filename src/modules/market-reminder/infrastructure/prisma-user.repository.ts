import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getAccountsWithNotificationSchedules() {}
}
