/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Produit {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true }) // Ensuring the id_reference_produit is unique if needed.
  id_reference_produit: string;

  @Column()
  nom: string;

  @Column('double')
  prix: number;

  @Column()
  stock: number;
}
