import { Controller, Get } from '@nestjs/common';
import { AreaDto } from 'src/application-core/dto/general/area-dto';
import { GetAllAreas } from 'src/application-core/use-cases/get-all-areas';

@Controller('areas')
export class AreaController {
  constructor(private readonly getAllAreas: GetAllAreas) {}

  @Get()
  async getAllAreasHandler(): Promise<AreaDto[]> {
    return await this.getAllAreas.execute();
  }
}
