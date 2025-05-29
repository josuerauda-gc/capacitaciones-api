import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AreaDto } from 'src/application-core/dto/general/area-dto';
import { GetAllAreas } from 'src/application-core/use-cases/get-all-areas';

@Controller('areas')
export class AreaController {
  constructor(private readonly getAllAreas: GetAllAreas) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Listado de áreas de evaluación',
    type: AreaDto,
  })
  async getAllAreasHandler(): Promise<AreaDto[]> {
    return await this.getAllAreas.execute();
  }
}
