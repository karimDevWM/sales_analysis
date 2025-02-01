/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Magasin {

  @PrimaryColumn()
  id_Magasin: number;

  @Column()
  ville: string;

  @Column('double')
  nombre_de_salaries: number;
}
