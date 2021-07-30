import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { first } from 'rxjs/operators';
import { AlertDialogComponent } from '@app/shared/components/alert-dialog/alert-dialog.component';
import { AuthenticationService } from '@app/_services';
import { UsuarioModel } from '@app/shared/models/Usuario-Model';
import { Subscription } from 'rxjs';
import { UserService } from '@app/shared/services/user.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  datagrupos: any = [];
  endloading = false;
  isDisabled = false;
  hayDatos = false;

  currentUser: UsuarioModel;
  currentUserSubscription: Subscription;

  mpbcolor = 'primary';
  mpbmode = 'indeterminate';
  mpbvalue = 50;
  mpbbufferValue = 75;

  grupoCtrl = new FormControl(0);
  filterCtrl = new FormControl('');

  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  @ViewChild(MatSort, null) sort: MatSort;
  origenDatos: any = [];
  datosLocales: any = [];
  columnasvisibles = ['nombre', 'apellido', 'username', 'numero_documento', 'acciones'];

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    public emergente: MatDialog,
    private usuarioServicios: UserService
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
      if (infolocal.ListaPerfiles.length > 0){
        const itemtodos: any = { name : 'Todos', value : 0 };
        this.datagrupos.push(itemtodos);
        infolocal.ListaPerfiles.forEach(element => {
          const itemadd: any = { name: element.nom_perfil, value: element.id_perfil };
          this.datagrupos.push(itemadd);
        });
        this.grupoCtrl.setValue(0);
      }
    }
    this.endloading = true;
  }

  ActualizarInformacion() {
    if (this.grupoCtrl.valid) {
      this.origenDatos = new MatTableDataSource();
      this.endloading = false;
            
      const filter: UsuarioModel = new UsuarioModel();
      if (this.filterCtrl.value !== '') {
        filter.username = this.filterCtrl.value;
      }
      // filter.IdGrupo = this.grupoCtrl.value;
     
      this.usuarioServicios.getAllUsers(filter)
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
      this.grupoCtrl.updateValueAndValidity();
      this.AbrirMensaje('Por favor selecciona un estado',
      'Campo requerido', 'report');
    }
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

  EditarUsuario(item: any) {
    localStorage.setItem('InfoEditarUsuario', JSON.stringify(item));
    this.router.navigate(['/crear-usuario']);
  }

  Salir() {
    this.router.navigate(['/']);
  }

  IraCrearUsuario(){
    localStorage.removeItem('InfoEditarUsuario');
    this.router.navigate(['/crear-usuario']);
  }

}
