import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from "rxjs/operators";

import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

import { Heroe, Publisher } from '../../interfaces/heroe.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
  img{
    width:100%
  }
  `
  ]
})
export class AgregarComponent implements OnInit {

publishers = [
  {
    id:'DC Comics',
    desc:'DC - Comics'
  },
  {
    id:'Marvel Comics',
    desc:'Marvel - Comics'
  }
]

heroe:Heroe = {
  superhero:'',
  alter_ego:'',
  characters:'',
  first_appearance:'',
  publisher:Publisher.DCComics,
  alt_img:''
}

  constructor(private heroesService:HeroesService,
              private activatedRoute:ActivatedRoute,
              private router:Router,
              private snackBar:MatSnackBar,
              private dialog:MatDialog) { }

  ngOnInit(): void {
    if(this.router.url.includes('editar')){
      this.activatedRoute.params
        .pipe(
          switchMap(({id}) => this.heroesService.getHeroesById(id))
        )
        .subscribe(heroe => this.heroe = heroe)
    }
  }

  guardar(){
    if(this.heroe.superhero.trim().length === 0){
      return;
    }

    if(this.heroe.id === undefined){
      //Crear
      this.heroesService.agregarHeroe(this.heroe)
      .subscribe(heroe => {
        this.router.navigate(['/heroes/editar',heroe.id]);
        this.mostrarSnackBar('Registro creado');
      })
    }else{
      //Actualizar
      this.heroesService.actualizarHeroe(this.heroe)
      .subscribe(resp => this.mostrarSnackBar('Registro actualizado'))
    }
    
  }

  borrar(){
    const dialog = this.dialog.open(ConfirmarComponent, {
      width:'50%',
      data:this.heroe
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if(result){
          this.heroesService.borrarHeroe(this.heroe.id!)
          .subscribe(resp => {
            this.router.navigate(['/heroes']);
          })          
        }
      }
    )
  }

  mostrarSnackBar(mnj:string){
    this.snackBar.open(mnj, 'Ok', {
      duration: 2500,
    });
  }

}
