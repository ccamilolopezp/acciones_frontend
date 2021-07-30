import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '@app/shared/components/alert-dialog/alert-dialog.component';
import { HallazgoModel } from '@app/shared/models/Hallazgo-Model';
import { UsuarioModel } from '@app/shared/models/Usuario-Model';
import { ServiciosHallazgos } from '@app/shared/services/hallazgos.service';
import { AuthenticationService } from '@app/_services';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-crear-hallazgo',
  templateUrl: './crear-hallazgo.component.html',
  styleUrls: ['./crear-hallazgo.component.css']
})
export class CrearHallazgoComponent implements OnInit {

  dataubicaciones: any = [];
  dataorigenes: any = [];
  datapersonas: any = [];
  dataparametros: any = [];
  dataconformidades: any = [];
  dataestados: any = [];

  endloading = false;
  isDisabled = false;
  infoedit: any;

  currentUser: UsuarioModel;
  currentUserSubscription: Subscription;

  mpbcolor = 'primary';
  mpbmode = 'indeterminate';
  mpbvalue = 50;
  mpbbufferValue = 75;

  origenDatos: any = [];
  datosLocales: any = [];

  minDate: any;
  fechalimintedef: any;
  diasdef: any;
  diasvence: any;

  basicaForm = new FormGroup({
    descripcion: new FormControl({value: null, disabled: false}, [Validators.required]),
    fechainicio:  new FormControl({value: null, disabled: false}, [Validators.required]),
    fechavence: new FormControl({value: null, disabled: true}, [Validators.required]),
    capitulo: new FormControl({ value: null, disabled: false }, [Validators.required]),
    fechaidentifica: new FormControl({ value: null, disabled: false }, [Validators.required]),
    detalleorigen: new FormControl({ value: null, disabled: false }, [Validators.required]),
    ubicacion: new FormControl({ value: null, disabled: false }, [Validators.required]),
    origen: new FormControl({ value: null, disabled: false }, [Validators.required]),
    primerauditor: new FormControl({ value: null, disabled: false }, [Validators.required]),
    segundoauditor: new FormControl({ value: null, disabled: false }, [Validators.required]),
    responsable: new FormControl({ value: null, disabled: false }, [Validators.required]),
    conformidad: new FormControl({ value: null, disabled: false }),
    estado: new FormControl({ value: null, disabled: false }),
  }, {updateOn: 'blur'});
  
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    public emergente: MatDialog,
    private hallazgoServicios: ServiciosHallazgos
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.loadDateRange();
    this.CargarInformacion();
  }

  loadDateRange() {
    // this.minDate = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate() + 1);
    this.minDate = new Date();
  }

  CargarInformacion() {
    const infolocal = JSON.parse(localStorage.getItem('ListasParametricas'));
    if (infolocal !== null) {
      if (infolocal.ListUbicaciones.length > 0){
        // const itemtodos: any = { name : 'Seleccione...', value : 0 };
        // this.dataubicaciones.push(itemtodos);
        infolocal.ListUbicaciones.forEach(element => {
          const itemadd: any = { name: element.nombre, value: element.cod_ubicacion };
          this.dataubicaciones.push(itemadd);
        });
        // this.basicaForm.controls.ubicacion.setValue(0);
      }

      if (infolocal.ListaOrigenes.length > 0){
        // const itemtodos: any = { name : 'Seleccione...', value : 0 };
        // this.dataorigenes.push(itemtodos);
        infolocal.ListaOrigenes.forEach(element => {
          const itemadd: any = { name: element.nombre, value: element.cod_origen };
          this.dataorigenes.push(itemadd);
        });
        // this.basicaForm.controls.origen.setValue(0);
      }

      if (infolocal.ListaUsuarios.length > 0){
        // const itemtodos: any = { name : 'Seleccione...', value : 0 };
        // this.datapersonas.push(itemtodos);
        infolocal.ListaUsuarios.forEach(element => {
          const itemadd: any = { name: element.StringValue, value: element.IntId };
          this.datapersonas.push(itemadd);
        });
        // this.basicaForm.controls.primerauditor.setValue(0);
        // this.basicaForm.controls.segundoauditor.setValue(0);
        // this.basicaForm.controls.responsable.setValue(0);
      }

      if (infolocal.ListaParametros.length > 0){
        infolocal.ListaParametros.forEach(element => {
          const itemadd: any = { name: element.nombre, value: element.valor };
          this.dataparametros.push(itemadd);
        });
      }

      if (infolocal.ListaTipoConformidad.length > 0){
        // const itemtodos: any = { name : 'Seleccione...', value : 0 };
        // this.datapersonas.push(itemtodos);
        infolocal.ListaTipoConformidad.forEach(element => {
          const itemadd: any = { name: element.nombre, value: element.cod_tipo_conformidad };
          this.dataconformidades.push(itemadd);
        });
        // this.basicaForm.controls.primerauditor.setValue(0);
        // this.basicaForm.controls.segundoauditor.setValue(0);
        // this.basicaForm.controls.responsable.setValue(0);
      }

      if (infolocal.ListaEstadoHallazgo.length > 0){
        // const itemtodos: any = { name : 'Seleccione...', value : 0 };
        // this.datapersonas.push(itemtodos);
        infolocal.ListaEstadoHallazgo.forEach(element => {
          const itemadd: any = { name: element.nombre, value: element.cod_estado_hallazgo };
          this.dataestados.push(itemadd);
        });
        // this.basicaForm.controls.primerauditor.setValue(0);
        // this.basicaForm.controls.segundoauditor.setValue(0);
        // this.basicaForm.controls.responsable.setValue(0);
      }
    }

    this.ValidarInformacion();
  }

  ValidarInformacion() {
    const infoedicion = JSON.parse(localStorage.getItem('InfoEditarHallazgo'));
    if (infoedicion !== null) {
      this.infoedit = infoedicion;
      this.CargarDetalles();
    } else {
      this.basicaForm.enable();
    }
    this.endloading = true;
  }

  CargarDetalles() {
    this.basicaForm.controls.descripcion.setValue(this.infoedit.descripcion);
    this.basicaForm.controls.fechainicio.setValue(this.infoedit.fecha_inicio);
    this.basicaForm.controls.fechavence.setValue(this.infoedit.fecha_vencimiento);
    this.basicaForm.controls.capitulo.setValue(this.infoedit.capitulo);
    this.basicaForm.controls.fechaidentifica.setValue(this.infoedit.fecha_identificacion);
    this.basicaForm.controls.detalleorigen.setValue(this.infoedit.detalle_origen);
    this.basicaForm.controls.origen.setValue(this.infoedit.cod_origen);
    this.basicaForm.controls.primerauditor.setValue(this.infoedit.cod_persona_oci);
    this.basicaForm.controls.segundoauditor.setValue(this.infoedit.cod_persona_oci2);
    this.basicaForm.controls.responsable.setValue(this.infoedit.cod_persona_responsable);
    this.basicaForm.controls.ubicacion.setValue(this.infoedit.cod_ubicacion);
    this.basicaForm.controls.estado.setValue(this.infoedit.cod_estado_hallazgo);
    this.basicaForm.controls.conformidad.setValue(this.infoedit.cod_tipo_conformidad);

    // Calcula días que faltan para vencimiento
    this.dateDiffInDays();
    // Calcula fecha para definición y días de vencimiento definición
    this.CalcularFechaDefinicion();
  }

  dateDiffInDays() {
    const a = new Date();
    const b = new Date(this.infoedit.fecha_vencimiento);
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    this.diasvence = Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  CalcularFechaDefinicion() {
    const a = new Date(this.infoedit.fecha_inicio);
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    const paramdias = Number(this.dataparametros.filter(item => item.name === 'Definicion')[0].value);

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate() + paramdias);

    this.fechalimintedef = new Date(a.getFullYear(), a.getMonth(), a.getDate() + paramdias);
    this.diasdef = Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  Guardar(){
    if (this.basicaForm.valid) {
      this.endloading = false;
      const filter: HallazgoModel = new HallazgoModel();
      
      if (this.infoedit) {
        if (this.ValidarCambios()) {
          filter.cod_hallazgo = this.infoedit.cod_hallazgo;
          filter.cod_estado_hallazgo = this.basicaForm.controls.estado.value;
          filter.cod_tipo_conformidad = this.basicaForm.controls.conformidad.value;
        } else {
          this.endloading = true;
          this.AbrirMensaje('', 'No se realizó ningún cambio.', 'warning');
          return;
        }
      }

      filter.descripcion = this.basicaForm.controls.descripcion.value;
      filter.fecha_inicio = this.basicaForm.controls.fechainicio.value;
      filter.fecha_vencimiento = this.basicaForm.controls.fechavence.value;
      filter.capitulo = this.basicaForm.controls.capitulo.value;
      filter.fecha_identificacion = this.basicaForm.controls.fechaidentifica.value;
      filter.detalle_origen = this.basicaForm.controls.detalleorigen.value;
      filter.cod_ubicacion = this.basicaForm.controls.ubicacion.value;
      filter.cod_origen = this.basicaForm.controls.origen.value;
      filter.cod_persona_oci = this.basicaForm.controls.primerauditor.value;
      filter.cod_persona_oci2 = this.basicaForm.controls.segundoauditor.value;
      filter.cod_persona_responsable = this.basicaForm.controls.responsable.value;
      
      this.hallazgoServicios.GuardarHallazgo(filter)
      .pipe(first())
      .subscribe(
        res => {
          if (res['data'] !== null) {
            this.isDisabled = false;

            if (res['data'] > 0) {
              this.endloading = true;
              this.basicaForm.reset();
              this.AbrirMensaje('', 'La información se guardó correctamente.', 'check');
              this.Volver();
            } else if (res['data'] === 0) {
              this.endloading = true;
              this.AbrirMensaje('','No se completó la operación. Si el problema persiste contacte al administrador del sistema.','content_paste_off');
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
      this.basicaForm.updateValueAndValidity();
      this.AbrirMensaje('Campos marcados con asterísco(*) y/o en rojo son requeridos.',
      'Campo requerido', 'report');
    }
  }

  ValidarCambios() {
    if (this.basicaForm.controls.descripcion.value !== this.infoedit.descripcion) return true;
    if (this.basicaForm.controls.fechainicio.value !== this.infoedit.fecha_inicio) return true;
    if (this.basicaForm.controls.fechavence.value !== this.infoedit.fecha_vencimiento) return true;
    if (this.basicaForm.controls.capitulo.value !== this.infoedit.capitulo) return true;
    if (this.basicaForm.controls.fechaidentifica.value !== this.infoedit.fecha_identificacion) return true;
    if (this.basicaForm.controls.detalleorigen.value !== this.infoedit.detalle_origen) return true;
    if (this.basicaForm.controls.ubicacion.value !== this.infoedit.cod_ubicacion) return true;
    if (this.basicaForm.controls.origen.value !== this.infoedit.cod_origen) return true;
    if (this.basicaForm.controls.primerauditor.value !== this.infoedit.cod_persona_oci) return true;
    if (this.basicaForm.controls.segundoauditor.value !== this.infoedit.cod_persona_oci2) return true;
    if (this.basicaForm.controls.responsable.value !== this.infoedit.cod_persona_responsable) return true;
    if (this.basicaForm.controls.estado.value !== this.infoedit.cod_estado_hallazgo) return true;
    if (this.basicaForm.controls.conformidad.value !== this.infoedit.cod_tipo_conformidad) return true;
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

  Volver() {
    this.router.navigate(['/hallazgos']);
  }

}
