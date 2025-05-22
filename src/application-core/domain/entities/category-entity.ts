import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'categoria' })
export class CategoryEntity {
  @PrimaryColumn({
    name: 'nkey',
    generated: 'increment',
    type: 'integer',
    nullable: false,
  })
  nKey: number;
  @Column({ name: 'idcat', type: 'integer', nullable: false })
  categoryId: number;
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
