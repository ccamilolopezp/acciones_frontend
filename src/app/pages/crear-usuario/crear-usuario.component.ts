import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { first } from 'rxjs/operators';
import { AlertDialogComponent } from '@app/shared/components/alert-dialog/alert-dialog.component';
import { AuthenticationService } from '@app/_services';
import { UsuarioModel } from '@app/shared/models/Usuario-Model';
import { Subscription } from 'rxjs';
import { UserService } from '@app/shared/services/user.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {

  datagrupos: any = [];
  endloading = false;
  isDisabled = false;
  hayDatos = -1;
  infoedit: any;

  currentUser: UsuarioModel;
  currentUserSubscription: Subscription;

  mpbcolor = 'primary';
  mpbmode = 'indeterminate';
  mpbvalue = 50;
  mpbbufferValue = 75;

  // grupoCtrl = new FormControl(null, [Validators.required]);
  correoCtrl = new FormControl('', [Validators.required]);

  origenDatos: any = [];
  datosLocales: any = [];

  basicaForm = new FormGroup({
    correo: new FormControl({value: null, disabled: true}, [Validators.required]),
    nombre:  new FormControl({value: null, disabled: true}, [Validators.required]),
    apellido: new FormControl({value: null, disabled: true}, [Validators.required]),
    numero_documento: new FormControl({ value: null, disabled: false }, [Validators.required]),
    perfil: new FormControl(null, [Validators.required]),
    // usuariocrea:  new FormControl(null, [Validators.required]),
  }, {updateOn: 'blur'});

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
    // console.log(infolocal);
    if (infolocal !== null) {
      if (infolocal.ListaPerfiles.length > 0){
        infolocal.ListaPerfiles.forEach(element => {
          const itemadd: any = { name: element.nom_perfil, value: element.id_perfil };
          this.datagrupos.push(itemadd);
        });
        // this.grupoCtrl.setValue(0);
      }
    }

    this.ValidarInformacion();
  }

  ValidarInformacion() {
    const infoedicion = JSON.parse(localStorage.getItem('InfoEditarUsuario'));
    
    if (infoedicion !== null) {
      this.infoedit = infoedicion;
      this.CargarDetalles();
    } 

    this.endloading = true;
  }

  CargarDetalles() {
    this.hayDatos = 1;
    // console.log(this.infoedit);
    this.basicaForm.controls.correo.setValue(this.infoedit.username);
    this.basicaForm.controls.nombre.setValue(this.infoedit.nombre);
    this.basicaForm.controls.apellido.setValue(this.infoedit.apellido);
    this.basicaForm.controls.perfil.setValue(this.infoedit.id_perfil);
    this.basicaForm.controls.numero_documento.setValue(this.infoedit.numero_documento);
    // this.basicaForm.controls.habilitado.enable();
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

  BuscarEnAD() {
    if (this.correoCtrl.valid) {

      this.endloading = false;
            
      const filter: UsuarioModel = new UsuarioModel();
      if (this.correoCtrl.value !== '') {
        filter.username = this.correoCtrl.value;
      }
     
      this.usuarioServicios.getUserAD(filter)
      .pipe(first())
      .subscribe(
        res => {
          if (res['data'] !== null) {
            this.isDisabled = false;

            if (res['data'].username !== '' && res['data'].username !== null) {
              this.hayDatos = 1;
              this.endloading = true;

              this.basicaForm.controls.correo.setValue(res['data'].username);
              this.basicaForm.controls.nombre.setValue(res['data'].nombre);
              this.basicaForm.controls.apellido.setValue(res['data'].apellido);
              // this.basicaForm.controls.usuariocrea.setValue(this.currentUser.nombre);
              // this.basicaForm.controls.habilitado.setValue(true);

            } else {
              this.endloading = true;
              this.hayDatos = 0;
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
      // this.grupoCtrl.updateValueAndValidity();
      this.AbrirMensaje('Por favor digita un nombre de usuario.',
      'Campo requerido', 'report');
    }
  }

  ValidarCambios() {
    if (this.basicaForm.controls.perfil.value !== this.infoedit.id_perfil) return true;
    if (this.basicaForm.controls.numero_documento.value !== this.infoedit.numero_documento) return true;
  }

  AsociarUsuario(){
    if (this.basicaForm.valid) {
      this.endloading = false;
      const filter: UsuarioModel = new UsuarioModel();
      if (this.infoedit) {
        if (this.ValidarCambios()) {
          filter.cod_persona = this.infoedit.cod_persona;
        } else {
          this.endloading = true;
          this.AbrirMensaje('', 'No se realizó ningún cambio.', 'warning');
          return;
        }
      } else {
        // filter.username = this.basicaForm.controls.correo.value;
        // filter.nombre = this.basicaForm.controls.nombre.value;
        // filter.apellido = this.basicaForm.controls.apellido.value;
        // filter.numero_documento = this.basicaForm.controls.numero_documento.value;
        // filter.id_perfil = this.basicaForm.controls.perfil.value;
      }

      filter.username = this.basicaForm.controls.correo.value;
      filter.nombre = this.basicaForm.controls.nombre.value;
      filter.apellido = this.basicaForm.controls.apellido.value;
      filter.numero_documento = this.basicaForm.controls.numero_documento.value;
      filter.id_perfil = this.basicaForm.controls.perfil.value;
      
      this.usuarioServicios.saveUser(filter)
      .pipe(first())
      .subscribe(
        res => {
          if (res['data'] !== null) {
            this.isDisabled = false;

            if (res['data'] > 0) {
              this.endloading = true;
              this.basicaForm.reset();
              this.correoCtrl.reset();
              this.hayDatos = -1;
              this.AbrirMensaje('', 'La información se guardó correctamente.', 'check');
              this.Volver();
            } else if (res['data'] === 0) {
              this.endloading = true;
              // this.hayDatos = 0;
              this.AbrirMensaje('','No se completó la operación. Contacte al administrador del sistema.','content_paste_off');
            } else {
              this.endloading = true;
              this.basicaForm.reset();
              this.correoCtrl.reset();
              this.hayDatos = -1;
              this.AbrirMensaje('','El usuario ya está asociado al sistema.','content_paste_off');
            }
          }
        },
        error => {
          this.AbrirMensaje('Lo sentimos, se presentó un error inesperado. Si el problema persiste contacte al administrador del sistema.',
          'Intenta nuevamente', 'report');
          this.isDisabled = true;
          this.endloading = true;
        });
    } else {
      // this.grupoCtrl.updateValueAndValidity();
      this.AbrirMensaje('Campos marcados en rojo son requeridos.',
      'Campo requerido', 'report');
    }
  }

  Volver() {
    this.router.navigate(['/usuarios']);
  }

}
