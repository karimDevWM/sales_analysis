/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToMany, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Produit } from './produit.entity';
import { Magasin } from './magasin.entity';

@Entity()
export class Vente {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'date'})
    date: Date;
    
    @Column()
    id_reference_produit: string;

    @ManyToMany(() => Produit, (produit) => produit.id_reference_produit)
    @JoinColumn({ name: 'id_reference_produit' })
    produit: Produit;

    @Column()
    quantite: number;

    @Column()
    id_magasin: string;

    @ManyToMany(() => Magasin, (magasin) => magasin.id_Magasin)
    @JoinColumn({ name: 'id_magasin' })
    magasin: Magasin;
}
