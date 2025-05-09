import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  @Get('/')
  @ApiResponse({ status: 200, description: 'Funcionando correctamente' })
  healthCheck() {
    return 'Funcionando correctamente';
  }
}
