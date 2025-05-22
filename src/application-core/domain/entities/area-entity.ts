import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'area' })
export class AreaEntity {
  @PrimaryColumn({
    name: 'nkey',
    generated: 'increment',
    type: 'integer',
    nullable: false,
  })
  nKey: number;
  @Column({ name: 'idarea', type: 'integer', nullable: false })
  areaId: number;
  @Column({
    name: 'descripcion',
    type: 'character varying',
    length: 100,
    nullable: false,
    default: '',
  })
  description: string;
  @Column({ name: 'activo', type: 'boolean', nullable: false, default: true })
  active: boolean;
}
