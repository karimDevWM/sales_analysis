/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as readline from 'readline';
import { Magasin } from './entities/magasin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Vente } from './entities/ventes.entity';
import { Repository } from 'typeorm';
import { Produit } from './entities/produit.entity';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Magasin)
    private magasinRepository: Repository<Magasin>,
    @InjectRepository(Produit)
    private produitRepository: Repository<Produit>,
    @InjectRepository(Vente)
    private venteRepository: Repository<Vente>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async CsvToArray(file: Express.Multer.File, option: string) {
    console.log("type : ", option);
    const fileStream = fs.createReadStream(file.path);
    const r1 = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    if(option == Reflect.getMetadata("name", Magasin) || Magasin.name) {
      const magasins : Partial<Magasin>[] = [];
      let isFirstLine = true;
      
      for await(const line of r1) {
        if(isFirstLine) {
          //skip the header row
          isFirstLine = false;
          continue;
        }

        const [id_Magasin, ville, nombre_de_salaries] = line.split(',');

        // validate and sanitize data here if needed   
        magasins.push({
          id_Magasin: parseInt(id_Magasin),
          ville: ville,
          nombre_de_salaries: parseInt(nombre_de_salaries),
        });
      }

      // save to database in batches
      for(const chunk of this.chunkArray(magasins, 100)) {
        await this.magasinRepository.save(chunk);
      }
      console.log("magasin table is charged");

    } else if(option == Reflect.getMetadata("name", Produit) || Produit.name) {
      const produits : Partial<Produit>[] = [];
      let isFirstLine = true;
      
      for await(const line of r1) {
        if(isFirstLine) {
          //skip the header row
          isFirstLine = false;
          continue;
        }

        const [nom, id_reference_produit, prix, stock] = line.split(',');

        // validate and sanitize data here if needed
        produits.push({
          nom: nom,
          id_reference_produit: id_reference_produit,
          prix: parseFloat(prix),
          stock: parseInt(stock),
        });
      }

      // save to database in batches
      for(const chunk of this.chunkArray(produits, 100)) {
        await this.produitRepository.save(chunk);
      }
      console.log("produit table is charged");

    } else if(option == Reflect.getMetadata("name", Vente) || Vente.name) {
      const ventes : Partial<Vente>[] = [];
      let isFirstLine = true;

      const existingEntries = new Set(
        (await this.venteRepository.find({ select: ['date', 'id_reference_produit', 'id_magasin'] }))
          .map((v) => `${v.date}-${v.id_reference_produit}-${v.id_magasin}`)
      );
      
      for await(const line of r1) {
        if(isFirstLine) {
          //skip the header row
          isFirstLine = false;
          continue;
        }

        const [date, id_reference_produit, quantite, id_Magasin] = line.split(',');
        const entryKey = `${date}-${id_reference_produit}-${id_Magasin}`;

        // validate and sanitize data here if needed
        if(!existingEntries.has(entryKey)) {
          ventes.push({
            date: new Date(date.trim()),
            id_reference_produit: id_reference_produit,
            quantite: parseInt(quantite),
            id_magasin: id_Magasin,
          });
        }
      }

      // save to database in batches
      if(ventes.length > 0) {
        for(const chunk of this.chunkArray(ventes, 100)) {
          await this.venteRepository.save(chunk);
        }
        console.log("vente table is charged");
      } else {
        console.log("No new data to insert in vente table.");
      }
    }
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[] {
    const result = [];
    for(let i = 0; i< array.length; i+= chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

}
