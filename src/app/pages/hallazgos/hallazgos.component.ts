import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '@app/shared/components/alert-dialog/alert-dialog.component';
import { UsuarioModel } from '@app/shared/models/Usuario-Model';
import { ServiciosHallazgos } from '@app/shared/services/hallazgos.service';
import { AuthenticationService } from '@app/_services';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-hallazgos',
  templateUrl: './hallazgos.component.html',
  styleUrls: ['./hallazgos.component.css']
})
export class HallazgosComponent implements OnInit {

  dataubicaciones: any = [];
  dataconformidades: any = [];
  endloading = false;
  isDisabled = false;
  hayDatos = false;

  currentUser: UsuarioModel;
  currentUserSubscription: Subscription;

  mpbcolor = 'primary';
  mpbmode = 'indeterminate';
  mpbvalue = 50;
  mpbbufferValue = 75;

  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  @ViewChild(MatSort, null) sort: MatSort;
  origenDatos: any = [];
  datosLocales: any = [];
  columnasvisibles = ['cod_hallazgo', 'capitulo', 'fecha_inicio', 'fecha_vencimiento', 'NombreEstado', 'acciones'];

  ubicacionesCtrl = new FormControl(0);
  conformidadesCtrl = new FormControl(0);
  anioCtrl = new FormControl('');
  
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    public emergente: MatDialog,
    private serviciosHallazgos: ServiciosHallazgos
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.CargarInformacion();
  }

  CargarInformacion() {
    const infolocal = JSON.parse(localStorage.getItem('ListasParametricas'));
    if (infolocal !== null) {
      // Carga Información de ubicaciones
      if (infolocal.ListUbicaciones.length > 0){
        const itemtodos: any = { name : 'TODAS', value : 0 };
        this.dataubicaciones.push(itemtodos);
        infolocal.ListUbicaciones.forEach(element => {
          const itemadd: any = { name: element.nombre, value: element.cod_ubicacion };
          this.dataubicaciones.push(itemadd);
        });
        this.ubicacionesCtrl.setValue(0);
      }
      // Carga información de Conformidades
      if (infolocal.ListaTipoConformidad.length > 0){
        const itemtodos: any = { name : 'CUALQUIERA', value : 0 };
        this.dataconformidades.push(itemtodos);
        infolocal.ListaTipoConformidad.forEach(element => {
          const itemadd: any = { name: element.nombre, value: element.cod_tipo_conformidad };
          this.dataconformidades.push(itemadd);
        });
        this.conformidadesCtrl.setValue(0);
      }
    }
    this.endloading = true;
  }

  ActualizarInformacion() {

    const filter: any = {
      cod_ubicacion: this.ubicacionesCtrl.value,
      cod_tipo_conformidad: this.conformidadesCtrl.value,
      Anio: this.anioCtrl.value
    };

    this.serviciosHallazgos.ListarHallazgos(filter)
    .pipe(first())
      .subscribe(
        res => {
          if (res['data'] !== null) {
            this.datosLocales = JSON.parse(res['data']);
            this.origenDatos = new MatTableDataSource();
            this.origenDatos.data = JSON.parse(res['data']);
            this.origenDatos.sort = this.sort;
            this.origenDatos.paginator = this.paginator;
            this.isDisabled = false;

            if (this.datosLocales.length > 0) {
              this.hayDatos = true;
              this.endloading = true;
            } else {
              this.endloading = true;
              this.hayDatos = false;
              this.AbrirMensaje('','No se encontraron resultados','content_paste_off');
            }
          }
        },
        error => {
          this.AbrirMensaje('Lo sentimos, se presentó un error inesperado.',
          'Intenta nuevamente', 'report');
          this.isDisabled = true;
          this.endloading = true;
        });
  }

  AplicarFiltros(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.origenDatos.filter = filterValue;
  }
  
  AbrirMensaje(pTitle: any, pContent: any, pIcon: any) {
    const dialogRef = this.emergente.open(AlertDialogComponent, {
      data: {
        title: pTitle,
        content: pContent,
        icon: pIcon,
        buttonText: {
          cancel: 'Entiendo'
        }
      },
      disableClose: true
    });
  }

  Salir() {
    this.router.navigate(['/']);
  }

  IraCrearHallazgo(){
    localStorage.removeItem('InfoEditarHallazgo');
    this.router.navigate(['/crear-hallazgo']);
  }

  EditarHallazgo(item: any) {
    localStorage.setItem('InfoEditarHallazgo', JSON.stringify(item));
    this.router.navigate(['/crear-hallazgo']);
  }

}
