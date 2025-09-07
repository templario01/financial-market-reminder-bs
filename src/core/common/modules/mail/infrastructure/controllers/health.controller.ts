import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class HealthController {
  @Get('health')
  @ApiOkResponse({ description: 'Health check' })
  getHealth() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }
}
