import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { first } from 'rxjs/operators';
import { AlertDialogComponent } from '@app/shared/components/alert-dialog/alert-dialog.component';
import { AuthenticationService } from '@app/_services';
import { UsuarioModel } from '@app/shared/models/Usuario-Model';
import { Subscription } from 'rxjs';
import { CasoModel } from '../../shared/models/Caso-Model';
import { ServiciosCasos } from '../../shared/services/caso.service';
import { HistoricoCasoComponent } from '../historico-caso/historico-caso.component';

@Component({
  selector: 'app-solicitudes-servicio',
  templateUrl: './solicitudes-servicio.component.html',
  styleUrls: ['./solicitudes-servicio.component.css']
})
export class SolicitudesServicioComponent implements OnInit {

  listaestados: any = [];
  endloading = false;
  isDisabled = false;
  hayDatos = false;
  estadoselect = 1;

  currentUser: UsuarioModel;
  currentUserSubscription: Subscription;

  mpbcolor = 'primary';
  mpbmode = 'indeterminate';
  mpbvalue = 50;
  mpbbufferValue = 75;

  inteUnoCtrl = new FormControl(null, [Validators.required]);
  filterCtrl = new FormControl('');

  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  @ViewChild(MatSort, null) sort: MatSort;
  origenDatos: any = [];
  datosLocales: any = [];
  columnasvisibles = ['id', 'fecCreacion', 'NombreEstado', 'NombreCategoria', 'NombreServicio', 'Responsable', 'Autor', 'Grupo', 'acciones'];

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    public emergente: MatDialog,
    private casosServicios: ServiciosCasos
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
      if (infolocal.ListaEstados.length > 0){
        const itemtodos: any = { name : 'Todos', value : -1 };
        this.listaestados.push(itemtodos);
        infolocal.ListaEstados.forEach(element => {
          const itemadd: any = { name : element.nombre, value : element.id };
          this.listaestados.push(itemadd);
        });
        this.inteUnoCtrl.setValue(-1);
      }
    }
    this.endloading = true;
  }

  ActualizarInformacion() {
    if (this.inteUnoCtrl.valid) {
      this.origenDatos = new MatTableDataSource();
      this.endloading = false;
            
      const filter: CasoModel = new CasoModel();
      if (this.filterCtrl.value !== '') {
        filter.contenidoPlantilla = this.filterCtrl.value;
      }
      filter.idEstado = this.inteUnoCtrl.value;
     
      this.casosServicios.ListarCasosFiltro(filter)
      .pipe(first())
      .subscribe(
        res => {
          if (res['data'] !== null) {
            this.datosLocales = res['data'];
            this.origenDatos = new MatTableDataSource();
            this.origenDatos.data = res['data'];
            this.origenDatos.sort = this.sort;
            this.origenDatos.paginator = this.paginator;
            this.isDisabled = false;

            if (res['data'].length > 0) {
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
    } else {
      this.inteUnoCtrl.updateValueAndValidity();
      this.AbrirMensaje('Por favor selecciona un estado',
      'Campo requerido', 'report');
    }
  }

  ActualizarInformacionCasos(cerrados: boolean) {
    if (this.inteUnoCtrl.valid) {
      this.origenDatos = new MatTableDataSource();
      this.endloading = false;
      const filter: CasoModel = new CasoModel();
      if (this.filterCtrl.value !== '') {
        filter.contenidoPlantilla = this.filterCtrl.value;
      }
      filter.idEstado = this.inteUnoCtrl.value;
      filter.idUsuarioAsignado=this.currentUser.cod_persona;
      if (cerrados) {
        filter.idEstado = 2;
      }
      
      this.casosServicios.ListarMisCasosFiltro(filter)
      .pipe(first())
      .subscribe(
        res => {
          if (res['data'] !== null) {
            this.datosLocales = res['data'];
            this.origenDatos = new MatTableDataSource();
            this.origenDatos.data = res['data'];
            this.origenDatos.sort = this.sort;
            this.origenDatos.paginator = this.paginator;
            this.isDisabled = false;

            if (res['data'].length > 0) {
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
    } else {
      this.inteUnoCtrl.updateValueAndValidity();
      this.AbrirMensaje('Por favor selecciona un estado',
      'Campo requerido', 'report');
    }
  }

  ActualizarInformacionCasosGrupo() {
    if (this.inteUnoCtrl.valid) {
      this.origenDatos = new MatTableDataSource();
      this.endloading = false;
      const filter: CasoModel = new CasoModel();
      if (this.filterCtrl.value !== '') {
        filter.contenidoPlantilla = this.filterCtrl.value;
      }
      filter.idEstado = this.inteUnoCtrl.value;
      filter.idUsuarioAsignado=this.currentUser.cod_persona;

      this.casosServicios.ListarCasosGrupoFiltro(filter)
      .pipe(first())
      .subscribe(
        res => {
          if (res['data'] !== null) {
            this.datosLocales = res['data'];
            this.origenDatos = new MatTableDataSource();
            this.origenDatos.data = res['data'];
            this.origenDatos.sort = this.sort;
            this.origenDatos.paginator = this.paginator;
            this.isDisabled = false;

            if (res['data'].length > 0) {
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
    } else {
      this.inteUnoCtrl.updateValueAndValidity();
      this.AbrirMensaje('Por favor selecciona un estado',
      'Campo requerido', 'report');
    }
  }

  AplicarFiltros(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.origenDatos.filter = filterValue;
  }

  selectInteUno() {
    // this.iteminteuno = this.inteUnoCtrl.value;

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
  
  EditarCaso(item: any) {
    localStorage.setItem('InfoEditarCaso', JSON.stringify(item));
    this.router.navigate(['/crear-solicitud-servicio']);
  }

  AbrirHistoricoCaso(item: any) {
    this.emergente.open(HistoricoCasoComponent, {
      data: {
        idcaso: item.id
      },
      width: '800px',
      maxHeight: '600px',
      disableClose: true
    });
  }

  Salir() {
    this.router.navigate(['/']);
  }

  IrCrearSolicitud(){
    localStorage.removeItem('InfoEditarCaso');
    this.router.navigate(['/crear-solicitud-servicio']);
  }

}
