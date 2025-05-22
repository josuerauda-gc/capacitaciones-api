import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EvaluationEntity } from './evaluation-entity';
import { AreaEntity } from './area-entity';
import { CategoryEntity } from './category-entity';
import { TypeObservationEntity } from './type-observation-entity';

@Entity({ name: 'ev_respuesta_detalle' })
export class EvaluationDetailEntity {
  @PrimaryColumn({
    name: 'idresp_det',
    generated: 'increment',
    type: 'integer',
    nullable: false,
  })
  evaluationDetailId: number;
  @ManyToOne(() => EvaluationEntity, (evaluation) => evaluation.evaluationId)
  @JoinColumn({ name: 'idresp' })
  evaluation: EvaluationEntity;
  @ManyToOne(() => AreaEntity, (area) => area.nKey)
  @JoinColumn({ name: 'idarea' })
  area: AreaEntity;
  @ManyToOne(() => CategoryEntity, (category) => category.nKey)
  @JoinColumn({ name: 'idcat' })
  category: CategoryEntity;
  @ManyToOne(
    () => TypeObservationEntity,
    (typeObservation) => typeObservation.nKey,
  )
  @JoinColumn({ name: 'idtipo' })
  typeObservation: TypeObservationEntity;
  @Column({
    name: 'comentario',
    type: 'character varying',
    nullable: false,
    default: '',
  })
  comments: string;
  @Column({
    name: 'fecha',
    type: 'timestamp with time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;
}
