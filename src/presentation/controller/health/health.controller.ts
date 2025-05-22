import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { WebdavService } from 'src/infraestructure/services/webdav/webdav.service';

@Controller('health')
export class HealthController {
  constructor(private readonly webdavService: WebdavService) {}

  @Get('/')
  @ApiResponse({ status: 200, description: 'Funcionando correctamente' })
  healthCheck() {
    return 'Funcionando correctamente';
  }
}
