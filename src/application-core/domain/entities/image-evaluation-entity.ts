import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EvaluationDetailEntity } from './evaluation-detail-entity';

@Entity({ name: 'ev_imagen' })
export class ImageEvaluationEntity {
  @PrimaryColumn({
    name: 'nkey',
    generated: 'increment',
    type: 'integer',
    nullable: false,
  })
  nKey: number;
  @Column({
    name: 'ruta_img',
    type: 'character varying',
    nullable: false,
    length: 300,
    default: '',
  })
  imgPath: string;
  @ManyToOne(
    () => EvaluationDetailEntity,
    (evaluationDetail) => evaluationDetail.evaluationDetailId,
  )
  @JoinColumn({ name: 'idresp_det' })
  evaluationDetail: EvaluationDetailEntity;
  @Column({
    name: 'fecha',
    type: 'timestamp with time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;
}
