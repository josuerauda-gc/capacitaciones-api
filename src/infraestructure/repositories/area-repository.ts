import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaEntity } from 'src/application-core/domain/entities/area-entity';
import IArea from 'src/application-core/interfaces/i-area';
import { Repository } from 'typeorm';

@Injectable()
export class AreaRepository implements IArea {
  constructor(
    @InjectRepository(AreaEntity)
    private readonly areaRepository: Repository<AreaEntity>,
  ) {}

  getAllAreas(): Promise<AreaEntity[]> {
    return this.areaRepository.find({
      where: { active: true },
    });
  }
}
