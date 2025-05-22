import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ev_respuesta' })
export class EvaluationEntity {
  @PrimaryColumn({
    name: 'idresp',
    generated: 'increment',
    type: 'integer',
  })
  evaluationId: number;
  @Column({ name: 'id_referencia', type: 'uuid', nullable: false })
  referenceCode: string;
  @Column({ name: 'id_sucursal', type: 'integer', nullable: false })
  branchId: number;
  @Column({
    name: 'nombre_sucursal',
    type: 'character varying',
    nullable: false,
    default: '',
  })
  branchName: string;
  @Column({
    name: 'gerente_turno',
    type: 'character varying',
    nullable: false,
    default: '',
  })
  managerName: string;
  @Column({
    name: 'evaluador',
    type: 'character varying',
    nullable: false,
    default: '',
  })
  evaluatorName: string;
  @Column({
    name: 'usuario',
    type: 'character varying',
    nullable: false,
    default: '',
  })
  username: string;
  @Column({
    name: 'comentario',
    type: 'character varying',
    nullable: false,
    default: '',
  })
  comments: string;
  @Column({ name: 'abierta', type: 'boolean', nullable: false, default: true })
  isOpen: boolean;
  @Column({
    name: 'fecha',
    type: 'timestamp with time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;
}
