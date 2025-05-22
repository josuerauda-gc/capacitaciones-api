import { AreaRepository } from 'src/infraestructure/repositories/area-repository';
import { AreaDto } from '../dto/general/area-dto';
import { Inject } from '@nestjs/common';
import { AREA_SERVICE } from 'src/infraestructure/interface-provider';
import { plainToInstance } from 'class-transformer';

export class GetAllAreas {
  constructor(
    @Inject(AREA_SERVICE)
    private readonly areaRepository: AreaRepository,
  ) {}

  async execute(): Promise<AreaDto[]> {
    const areas = await this.areaRepository.getAllAreas();
    return plainToInstance(AreaDto, areas, {
      excludeExtraneousValues: true,
    });
  }
}
