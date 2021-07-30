import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioModel } from '@app/shared/models/Usuario-Model';
import { Subscription } from 'rxjs';
import { AuthenticationService, UserService } from '@app/_services';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '@app/shared/components/alert-dialog/alert-dialog.component';
import { ServiciosCatalogos } from '../../shared/services/catalogos.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit, OnDestroy {

  currentUser: UsuarioModel;
  currentUserSubscription: Subscription;

  endloading = false;
  endrefresh = true;
  nombrePerfil = '';

  mpbcolor = 'primary';
  mpbmode = 'indeterminate';
  mpbvalue = 50;
  mpbbufferValue = 75;

  totalEnviadas = 0;
  totalDevueltas = 0;
  totalAprobadas = 0;
  totalEstadoAsociados = 0;
  listaTotalEstadoAsociados: any = [];

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private catalogoServicios: ServiciosCatalogos,
    public emergente: MatDialog
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.validarPerfil();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    // localStorage.removeItem('datosTotalesAdmin');
    this.currentUserSubscription.unsubscribe();
  }

  validarPerfil() {
    this.endloading = true;
    if (this.currentUser.Perfiles !== null && this.currentUser.Perfiles.length > 0) {
      this.nombrePerfil = this.currentUser.Perfiles[0];
    }
    this.validarInformacion();
  }

  salir() {
    this.authenticationService.logout();
    this.router.navigate(['/ingreso']);
  }

  validarInformacion() {
    this.endrefresh = false;
    const infolocal = JSON.parse(localStorage.getItem('ListasParametricas'));
    if (infolocal === null || infolocal.length === 0) {
      this.ConsultaInfoParametrica();
      this.endrefresh = true;
    } else {
      this.endrefresh = true;
    }
  }

  ConsultaInfoParametrica() {
    this.endrefresh = false;
    this.catalogoServicios.ConsultaInfoParametrica()
    .pipe(first())
    .subscribe(
      res => {
        if (res.data !== null) {
          localStorage.setItem('ListasParametricas', res.data);
          this.validarInformacion();
        }
      },
      error => {
        this.AbrirMensaje('Lo sentimos, se presentó un error inesperado.',
        'Intenta nuevamente dando clic en Actualizar', 'report');
          this.endrefresh = true;
      });
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

  IrUsuarios() {
    this.router.navigate(['/usuarios']);
  }

  IrHallazgos() {
    this.router.navigate(['/hallazgos']);
  }

  IrSolicitudesServicio() {
    this.router.navigate(['/solicitudes-servicio']);
  }

  IrAReporte() {
    this.router.navigate(['/visualizar-reporte']);
  }

}
