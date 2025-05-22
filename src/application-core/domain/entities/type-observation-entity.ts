import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tipo_observacion' })
export class TypeObservationEntity {
  @PrimaryColumn({
    name: 'nkey',
    generated: 'increment',
    type: 'integer',
    nullable: false,
  })
  nKey: number;
  @Column({ name: 'idtipo', type: 'integer', nullable: false })
  typeObservationId: number;
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
