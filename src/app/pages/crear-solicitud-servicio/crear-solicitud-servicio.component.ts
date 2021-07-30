import { Component, OnInit, NgZone, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from '@app/_services';
import { MatCheckboxChange, MatDialog, MatPaginator, MatSort, MatStepper, MatTableDataSource } from '@angular/material';
import { ɵINTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic';
import { NgxImageCompressService } from 'ngx-image-compress';
import { DOCUMENT } from '@angular/common';
import { AlertDialogComponent } from '@app/shared/components/alert-dialog/alert-dialog.component';
import { ServiciosCasos } from '@app/shared/services/caso.service';
import { CasoModel } from '../../shared/models/Caso-Model';
import { UsuarioModel } from '@app/shared/models/Usuario-Model';
import { Subscription } from 'rxjs';
import { AdjuntoModel } from '../../shared/models/Adjunto-Model';
import { NotaModel } from '../../shared/models/Nota-Model';
import { DomSanitizer } from '@angular/platform-browser';
import { element } from 'protractor';
import { environment } from 'src/environments/environment';


export interface JsonCatalog {
  name: string;
  value: boolean;
}

export interface BenefCatalog {
  tipodocumento: string;
  numerodocumento: string;
  nombres: string;
  apellidos: string;
}

@Component({
  selector: 'app-crear-solicitud-servicio',
  templateUrl: './crear-solicitud-servicio.component.html',
  styleUrls: ['./crear-solicitud-servicio.component.css']
})
export class CrearSolicitudServicioComponent implements OnInit {

  @ViewChild('stepper', null) stepper: MatStepper;
  @ViewChild('ImgFrente', { static: false }) ImgFrente: ElementRef;
  @ViewChild('ImgAtras', { static: false }) ImgAtras: ElementRef;
  @ViewChild('imageInput', null) imageInput: ElementRef;
   
    loading = false;
    submitted = false;
    ciudadError = false;
    isloadfrontimg = false;
    copiainfodenunciante = false;
    // finproceso = false;
    aceptoterminos = false;
    btnAgregarBenef = false;
    btnAgregaVehiculo = false;
    endloading = true;
    endloadingfoto = true;
    endloadingfotob = true;
    validatestep1 = true;

    widthtest: string;
    displayimg: string;
    loginForm: FormGroup;

    returnUrl: string;
    resultado: any;
    infoedit: any;
    listaestados: any = [];
    listaresultados: any=[];
    listagrupos: any = [];
    listaservicios: any = [];
    listaserviciosfiltro: any = [];
    listausuarios: any = [];
    listausuariosfiltro: any = [];
    listaAdjuntos: any = [];
    listaNotas: any = [];
    servarray: string[];
    servicio: any=[];
    listacategorias: any = [];
    listalocalidades: any = [];

    mpbcolor = 'primary';
    mpbmode = 'indeterminate';
    mpbvalue = 50;
    mpbbufferValue = 75;

    public divlogi = false;
    public divregi = false;
    public divthan = false;
    public divoffs = false;
    public divload = true;

    minDate: any;
    maxDate: any;
    minDateVs: any;
    maxDateVs: any;
    minDateVt: any;
    maxDateVt: any;

    ImagenFrente = '';
    ImagenAtras = '';

    loadImagenFrente = '';
    loadImagenAtras = '';

    file: any;
    localUrl: any;
    archivoadjunto: File;
    localmimetype = '';
    localCompressedURl: any;
    imgResultAfterCompress: string;

    isDisabled = false;
    hayDatos = false;

    @ViewChild(MatPaginator, null) paginator: MatPaginator;
    @ViewChild(MatSort, null) sort: MatSort;
    columnasvisibles = ['nombre', 'acciones'];
    origenDatos: any = [];

    hayDatos2 = false;
    @ViewChild(MatPaginator, null) paginator2: MatPaginator;
    @ViewChild(MatSort, null) sort2: MatSort;
    columnasvisibles2 = ['contenido', 'acciones'];
    origenDatos2: any = [];
    
    currentUser: UsuarioModel;
    currentUserSubscription: Subscription;

    constructor(
      @Inject(DOCUMENT) private document: Document,
      private renderer: Renderer2,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private userService: UserService,
      private alertService: AlertService,
      public zone: NgZone,
      public emergente: MatDialog,
      private imageCompress: NgxImageCompressService,
      private casoService: ServiciosCasos,
      private sanitizer:DomSanitizer
    ) { 
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
        this.currentUser = user;
      });
    }

    basicaForm = new FormGroup({
      estado: new FormControl({value: null, disabled: false}, [Validators.required]),
      servicio: new FormControl(null, [Validators.required]),
      categoria: new FormControl(null, [Validators.required]),
      grupo: new FormControl(null, [Validators.required]),
      funcionario: new FormControl(null, [Validators.required]),
      resultado:  new FormControl(null),
      plantilla: new FormControl(null, [Validators.required]),
      solucion: new  FormControl(null),
    }, {updateOn: 'blur'});


    denuncianteForm = new FormGroup({
      numIdentificacionDenunciante: new FormControl(null, [Validators.required]),
      nombreDenunciante: new FormControl(null, [Validators.required]),
      direccionDenunciante: new FormControl(null, [Validators.maxLength(200), Validators.required]),
      emailDenunciante: new FormControl(null, [Validators.email, Validators.maxLength(100), Validators.required]),
      telefonoDenunciante: new FormControl(null, [Validators.pattern(/[0-9]/), Validators.maxLength(15), Validators.required]),
      edadDenunciante: new FormControl(null, [Validators.required]),
      localidadDenunciante:  new FormControl(null, [Validators.required]),
    }, {updateOn: 'blur'});

    victimaForm = new FormGroup({
      numIdentificacionVictima: new FormControl(null, [Validators.required]),
      nombreVictima: new FormControl(null, [Validators.required]),
      direccionVictima: new FormControl(null, [Validators.maxLength(200), Validators.required]),
      emailVictima: new FormControl(null, [Validators.email, Validators.maxLength(100), Validators.required]),
      telefonoVictima: new FormControl(null, [Validators.pattern(/[0-9]/), Validators.maxLength(15), Validators.required]),
      edadVictima: new FormControl(null, [Validators.required]),
      localidadVictima:  new FormControl(null, [Validators.required]),
    }, {updateOn: 'blur'});

    adjuntoForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      archivo: new FormControl({value: null, disabled: true}, [Validators.required]),
    }, {updateOn: 'blur'});

    notaForm = new FormGroup({
      contenido: new FormControl(null, [Validators.required]),
    }, {updateOn: 'blur'});

    claveCtrl = new FormControl(null, [Validators.required]);

    ngOnInit() {
      this.CargarInformacion();
      this.cargarRangoFechas();
      this.widthtest = '32%';
      this.displayimg = 'block';
      setTimeout(() => {
        this.divlogi = true;
        this.divload = false;
      }, 1000);
    }

    sanitize(url:string){
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    CopiarInfoDenunciante(event: MatCheckboxChange): void {
      if (event.checked) {
        this.victimaForm.controls.numIdentificacionVictima.setValue(this.denuncianteForm.controls.numIdentificacionDenunciante.value);
        this.victimaForm.controls.nombreVictima.setValue(this.denuncianteForm.controls.nombreDenunciante.value);
        this.victimaForm.controls.direccionVictima.setValue(this.denuncianteForm.controls.direccionDenunciante.value);
        this.victimaForm.controls.emailVictima.setValue(this.denuncianteForm.controls.emailDenunciante.value);
        this.victimaForm.controls.telefonoVictima.setValue(this.denuncianteForm.controls.telefonoDenunciante.value);
        this.victimaForm.controls.edadVictima.setValue(this.denuncianteForm.controls.edadDenunciante.value);
        this.victimaForm.controls.localidadVictima.setValue(this.denuncianteForm.controls.localidadDenunciante.value);
      } else {
        this.victimaForm.reset();
      }
    }

    CargarInformacion() {
      const infolocal = JSON.parse(localStorage.getItem('ListasParametricas'));
      if (infolocal !== null) {
        
        if (infolocal.ListaEstados.length > 0){
          infolocal.ListaEstados.forEach(element => {
            const itemadd: any = { name : element.nombre, value : element.id };
            this.listaestados.push(itemadd);
          });
        }
        if (infolocal.ListaGrupos.length > 0){
          infolocal.ListaGrupos.forEach(element => {
            const itemadd: any = { name : element.nombre, value : element.Id };
            this.listagrupos.push(itemadd);
          });
        }
        if (infolocal.ListaCategorias.length > 0){
          infolocal.ListaCategorias.forEach(element => {
            const itemadd: any = { name : element.nombre, value : element.id };
            this.listacategorias.push(itemadd);
          });
        }
        if (infolocal.ListaServicios.length > 0){
          infolocal.ListaServicios.forEach(element => {
             const itemadd: any = { name: element.nombre, value: element.id, idcat: element.idCategoria, plantilla: element.contenidoPlantilla };
             this.listaservicios.push(itemadd);
          });
        }
        if (infolocal.ListaUsuarios.length > 0){
          infolocal.ListaUsuarios.forEach(element => {
            const itemadd: any = { name : element.StringValue, value : element.LongId, idgrupo: element.IntId };
            this.listausuarios.push(itemadd);
          });
        }
        if (infolocal.ListaLocalidades.length > 0){
          infolocal.ListaLocalidades.forEach(element => {
            const itemadd: any = { name : element.nomLocalidad, value : element.idLocalidad};
            this.listalocalidades.push(itemadd);
          });
        }
        if (infolocal.ListaResultados.length > 0){
          infolocal.ListaResultados.forEach(element => {
            const itemadd: any = { name : element.nomResultado, value : element.idResultado};
            this.listaresultados.push(itemadd);
          });
        }
      }
      this.ValidarInformacion();
    }

    ValidarInformacion() {
      const infoedicion = JSON.parse(localStorage.getItem('InfoEditarCaso'));

      if (infoedicion === null || infoedicion.length === 0) {

      } else {
        this.infoedit = infoedicion;
        this.CargarDetalles();
      }
      this.endloading = true;
    }

    PruebaDescargarAdjunto(item: any) {
      const url: any = `${environment.apiUrl}login/descargaradjunto/${item.id}`;
      window.open(url, '_blank');
    }

    CargarDetalles() {

      if (this.infoedit.idUsuarioAsignado !== this.currentUser.cod_persona) {
        this.basicaForm.controls.estado.disable();
      }

      //this.basicaForm.controls.asunto.setValue(this.infoedit.asunto);
      this.basicaForm.controls.plantilla.setValue(this.infoedit.contenidoPlantilla);
      this.basicaForm.controls.estado.setValue(this.infoedit.idEstado);
      this.basicaForm.controls.grupo.setValue(this.infoedit.idGrupo);
      this.basicaForm.controls.solucion.setValue(this.infoedit.contenidoSolucion);
      this.basicaForm.controls.resultado.setValue(this.infoedit.idResultado);
      this.denuncianteForm.controls.numIdentificacionDenunciante.setValue(this.infoedit.numIdentificacionDenunciante);
      this.denuncianteForm.controls.nombreDenunciante.setValue(this.infoedit.nombreDenunciante);
      this.denuncianteForm.controls.direccionDenunciante.setValue(this.infoedit.direccionDenunciante);
      this.denuncianteForm.controls.emailDenunciante.setValue(this.infoedit.emailDenunciante);
      this.denuncianteForm.controls.telefonoDenunciante.setValue(this.infoedit.telefonoDenunciante);
      this.denuncianteForm.controls.edadDenunciante.setValue(this.infoedit.edadDenunciante);
      this.denuncianteForm.controls.localidadDenunciante.setValue(this.infoedit.idLocalidadDenunciante);

      this.victimaForm.controls.numIdentificacionVictima.setValue(this.infoedit.numIdentificacionVictima);
      this.victimaForm.controls.nombreVictima.setValue(this.infoedit.nombreVictima);
      this.victimaForm.controls.direccionVictima.setValue(this.infoedit.direccionVictima);
      this.victimaForm.controls.emailVictima.setValue(this.infoedit.emailVictima);
      this.victimaForm.controls.telefonoVictima.setValue(this.infoedit.telefonoVictima);
      this.victimaForm.controls.edadVictima.setValue(this.infoedit.edadVictima);
      this.victimaForm.controls.localidadVictima.setValue(this.infoedit.idLocalidadVictima);
      

      const idserviciolocal: any = this.listaservicios.filter(item => item.value === this.infoedit.idServicio);
      this.basicaForm.controls.categoria.setValue(idserviciolocal[0].idcat);
      this.listaserviciosfiltro = this.listaservicios.filter(function(item){
        return item.idcat === idserviciolocal[0].idcat;
      });
      this.basicaForm.controls.servicio.setValue(this.infoedit.idServicio);
      this.ChangeGrupo(this.infoedit.idGrupo);
      this.basicaForm.controls.funcionario.setValue(this.infoedit.idUsuarioAsignado);

      this.listaAdjuntos = this.infoedit.ListaAdjuntos;
      if (this.listaAdjuntos !== null && this.listaAdjuntos.length > 0) {
        this.ActualizaTablaAdjuntos();
      }

      this.listaNotas = this.infoedit.ListaNotas;
      if (this.listaNotas !== null && this.listaNotas.length > 0) {
        this.ActualizaTablaNotas();
      }

      if (this.infoedit.idEstado === 2) {
        this.basicaForm.disable();
        this.denuncianteForm.disable();
        this.victimaForm.disable();
        this.copiainfodenunciante = true;
      }

    }

    ChangeCategoria(pitem: any) {
      this.basicaForm.controls.plantilla.setValue(null);
      this.listaserviciosfiltro = this.listaservicios.filter(function(item){
        return item.idcat === pitem;
      });
    }

    ChangeServicio(pitem: any) {
      const plantillasel: any = this.listaservicios.filter(item => item.value === pitem);
      this.basicaForm.controls.plantilla.setValue(plantillasel[0].plantilla);
    }

    ChangeGrupo(pitem: any){
      this.listausuariosfiltro = this.listausuarios.filter(function(item){
        return item.idgrupo === pitem;
      });
    }

    onFileChange() {
      const el: HTMLElement = this.imageInput.nativeElement;
      el.click();
    }

    AgregarAdjunto() {
      if (this.adjuntoForm.valid) {
        if (this.archivoadjunto !== null && this.archivoadjunto !== undefined){
          const itemadd: AdjuntoModel = new AdjuntoModel();
          itemadd.nombre = this.adjuntoForm.controls.nombre.value;
          itemadd.archivo = this.archivoadjunto;
          itemadd.ruta =  '';
          itemadd.id = 0;
          itemadd.fechaCrea = '';
          itemadd.usuarioCrea = 0;
          itemadd.mimetype = this.localmimetype;
  
          const existe: any = this.listaAdjuntos.filter(value =>
            value.nombre === itemadd.nombre);
  
          if (existe !== null && existe !== undefined && existe.length > 0) {
            this.goTop();
            this.AbrirMensaje('Nombre ya existe.', 'No puedes agregar dos veces el mismo Nombre Archivo.', 'pan_tool');
          } else {
            this.listaAdjuntos.push(itemadd);
            this.ActualizaTablaAdjuntos();
            this.adjuntoForm.reset();
            this.archivoadjunto = undefined;
            this.localmimetype = '';
          }
        } else {
          this.AbrirMensaje('', 'Debe seleccionar un archivo', 'attach_file');
        }
        
      }else {
        this.goTop();
        this.AbrirMensaje('', 'Campos marcados en rojo son necesarios', 'pan_tool');
        this.adjuntoForm.updateValueAndValidity();  
      }
    }

    AgregarNota() {
      if (this.notaForm.valid) {
        const itemadd: NotaModel = new NotaModel();
        itemadd.contenido = this.notaForm.controls.contenido.value;
        if (itemadd.contenido !== null && itemadd.contenido !== undefined){
          itemadd.id = 0;
          itemadd.fechaCrea = '';
          itemadd.usuarioCrea = 0;
  
          const existe: any = this.listaNotas.filter(value =>
            value.contenido === itemadd.contenido);
          
          if (existe !== null && existe !== undefined && existe.length > 0) {
            this.goTop();
            this.AbrirMensaje('Nota ya existe.', 'No puedes agregar dos veces el mismo contenido en la nota.', 'pan_tool');
          } else {
            this.listaNotas.push(itemadd);
            this.ActualizaTablaNotas();
            this.notaForm.reset();
          }
        } else {
          this.AbrirMensaje('', 'Debe seleccionar una nota', 'Nota');
        }
        
      }else {
        this.goTop();
        this.AbrirMensaje('', 'Campos marcados en rojo son necesarios', 'pan_tool');
        this.adjuntoForm.updateValueAndValidity();  
      }
    }

    BorrarAdjunto(pitem: any) {
      if (this.listaAdjuntos.indexOf(pitem) > -1) {
        this.listaAdjuntos.splice(this.listaAdjuntos.indexOf(pitem), 1);
        this.ActualizaTablaAdjuntos();
      }
    }

    BorrarNota(pitem: any) {
      if (this.listaNotas.indexOf(pitem) > -1) {
        this.listaNotas.splice(this.listaNotas.indexOf(pitem), 1);
        this.ActualizaTablaNotas();
      }
    }

    ActualizaTablaAdjuntos() {
      this.origenDatos = new MatTableDataSource();
      this.origenDatos.data = this.listaAdjuntos;
      this.origenDatos.sort = this.sort;
      this.origenDatos.paginator = this.paginator;

      if (this.listaAdjuntos.length > 0){
        this.hayDatos = true;
      }else{
        this.hayDatos = false;
      }
    }

    ActualizaTablaNotas() {
      this.origenDatos2 = new MatTableDataSource();
      this.origenDatos2.data = this.listaNotas;
      this.origenDatos2.sort = this.sort2;
      this.origenDatos2.paginator = this.paginator2;

      if (this.listaNotas.length > 0){
        this.hayDatos2 = true;
      }else{
        this.hayDatos2 = false;
      }
    }

    cargarRangoFechas() {
      this.minDate = new Date((new Date()).getFullYear() - 90, (new Date()).getMonth(), 1);
      this.maxDate = new Date((new Date()).getFullYear() - 18, (new Date()).getMonth(), 1);

      this.minDateVs = new Date();
      this.maxDateVs = new Date((new Date()).getFullYear() + 1, (new Date()).getMonth(), (new Date()).getDate() + 1);

      this.minDateVt = new Date();
      this.maxDateVt = new Date((new Date()).getFullYear() + 1, (new Date()).getMonth(), (new Date()).getDate() + 1);
    }

    // convenience getter for easy access to form fields
    get f() { return this.denuncianteForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.denuncianteForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.denuncianteForm.value)
        .pipe(first())
        .subscribe(
            data => {
                this.alertService.success('Registration successful', true);
                this.router.navigate(['/ingreso']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    goNext() {
      this.stepper.selected.completed = true;
      this.stepper.next();
      this.goTop();
    }

    goBack() {
      this.stepper.selected.completed = true;
      this.stepper.previous();
    }

    Cancelar(){
      this.endloading = true;
      this.router.navigate(['/solicitudes-servicio']);
    }

    ValidarCambios() {
      //if (this.basicaForm.controls.asunto.value !== this.infoedit.asunto) return true;
      if (this.basicaForm.controls.plantilla.value !== this.infoedit.contenidoPlantilla) return true;
      if (this.basicaForm.controls.estado.value !== this.infoedit.idEstado) return true;
      if (this.basicaForm.controls.grupo.value !== this.infoedit.idGrupo) return true;
      if (this.basicaForm.controls.funcionario.value !== this.infoedit.idUsuarioAsignado) return true;
      if (this.basicaForm.controls.servicio.value !== this.infoedit.idServicio) return true;
      if (this.basicaForm.controls.solucion.value !== this.infoedit.contenidoSolucion) return true;
      if (this.basicaForm.controls.resultado.value !== this.infoedit.idResultado) return true;
      if (this.denuncianteForm.controls.numIdentificacionDenunciante.value !== this.infoedit.numIdentificacionDenunciante) return true;
      if (this.denuncianteForm.controls.nombreDenunciante.value !== this.infoedit.nombreDenunciante) return true;
      if (this.denuncianteForm.controls.direccionDenunciante.value !== this.infoedit.direccionDenunciante) return true;
      if (this.denuncianteForm.controls.emailDenunciante.value !== this.infoedit.emailDenunciante) return true;
      if (this.denuncianteForm.controls.telefonoDenunciante.value !== this.infoedit.telefonoDenunciante) return true;
      if (this.denuncianteForm.controls.edadDenunciante.value !== this.infoedit.edadDenunciante) return true;
      if (this.denuncianteForm.controls.localidadDenunciante.value !== this.infoedit.idLocalidadDenunciante) return true;
      
      if (this.victimaForm.controls.numIdentificacionVictima.value !== this.infoedit.numIdentificacionVictima) return true;
      if (this.victimaForm.controls.nombreVictima.value !== this.infoedit.nombreVictima) return true;
      if (this.victimaForm.controls.direccionVictima.value !== this.infoedit.direccionVictima) return true;
      if (this.victimaForm.controls.emailVictima.value !== this.infoedit.emailVictima) return true;
      if (this.victimaForm.controls.telefonoVictima.value !== this.infoedit.telefonoVictima) return true;
      if (this.victimaForm.controls.edadVictima.value !== this.infoedit.edadVictima) return true;
      if (this.victimaForm.controls.localidadVictima.value !== this.infoedit.idLocalidadVictima) return true;
      const adjnuevos: any = this.listaAdjuntos.filter(item => item.id === 0);
      if (adjnuevos !== null && adjnuevos.length > 0) return true;
      const notasnuevos: any = this.listaNotas.filter(item => item.id === 0);
      if (notasnuevos !== null && notasnuevos.length > 0) return true;
    }

    ValidarSolucionado(){
      if(this.basicaForm.controls.estado.value === 2 ){
        if(this.basicaForm.controls.solucion.value === '' || this.basicaForm.controls.solucion.value === null){
          return 2;
        }
        else if(this.basicaForm.controls.resultado.value === null){
          return 1;
        }
      }
      return 0;
    }

    Guardar(){
      this.endloading = false;
      if (this.basicaForm.valid) {
        if (this.denuncianteForm.valid) {
          if (this.victimaForm.valid){
            const itemadd: CasoModel = new CasoModel();
            if (this.infoedit) {
              if (this.ValidarCambios()) {
                const r= this.ValidarSolucionado();
                if (r === 0) {
                  itemadd.id = this.infoedit.id;
                } else {
                  if (r === 1) {
                    this.AbrirMensaje('', 'El campo Resultado es requerido.', 'warning');
                    this.stepper.selectedIndex = 0;
                    this.endloading = true;
                    return;
                  } else if (r === 2) {
                    this.AbrirMensaje('', 'El campo Solución es requerido.', 'warning');
                    this.stepper.selectedIndex = 0;
                    this.endloading = true;
                    return;
                  }
                }
              } else {
                this.AbrirMensaje('', 'No se realizó ningún cambio.', 'warning');
                this.Cancelar();
                return;
              }
            }
  
            //Información básica
            itemadd.idEstado = this.basicaForm.controls.estado.value;
            itemadd.idGrupo = this.basicaForm.controls.grupo.value;
            itemadd.idServicio = this.basicaForm.controls.servicio.value;
            itemadd.idResultado = this.basicaForm.controls.resultado.value;
            itemadd.idUsuarioAsignado = this.basicaForm.controls.funcionario.value;
            itemadd.contenidoPlantilla = this.basicaForm.controls.plantilla.value;
            itemadd.idUsuarioCreacion = this.currentUser.cod_persona;
            itemadd.contenidoSolucion = this.basicaForm.controls.solucion.value;
            //Información denunciante
            itemadd.numIdentificacionDenunciante = this.denuncianteForm.controls.numIdentificacionDenunciante.value;
            itemadd.nombreDenunciante = this.denuncianteForm.controls.nombreDenunciante.value;
            itemadd.direccionDenunciante = this.denuncianteForm.controls.direccionDenunciante.value;
            itemadd.emailDenunciante = this.denuncianteForm.controls.emailDenunciante.value;
            itemadd.telefonoDenunciante = this.denuncianteForm.controls.telefonoDenunciante.value;
            itemadd.edadDenunciante = this.denuncianteForm.controls.edadDenunciante.value;
            itemadd.idLocalidadDenunciante = this.denuncianteForm.controls.localidadDenunciante.value;
            //Información víctima
            itemadd.numIdentificacionVictima = this.victimaForm.controls.numIdentificacionVictima.value;
            itemadd.nombreVictima = this.victimaForm.controls.nombreVictima.value;
            itemadd.direccionVictima = this.victimaForm.controls.direccionVictima.value;
            itemadd.emailVictima = this.victimaForm.controls.emailVictima.value;
            itemadd.telefonoVictima = this.victimaForm.controls.telefonoVictima.value;
            itemadd.edadVictima = this.victimaForm.controls.edadVictima.value;
            itemadd.idLocalidadVictima = this.victimaForm.controls.localidadVictima.value;
  
            itemadd.ListaNotas = this.listaNotas.filter(item => item.id === 0);
            
            this.casoService.GuardarCaso(itemadd)
            .pipe(first())
            .subscribe(
              res => {
                const resultado: any = res['data'];
                if (resultado !== null && resultado > 0) {
                  if (this.listaAdjuntos !== null && this.listaAdjuntos.length > 0)
                  {
                    this.listaAdjuntos.forEach(elementadd => {
                      if (elementadd.id == 0 ) {
                          // const adjuntoadd:AdjuntoModel = new AdjuntoModel();
                          // adjuntoadd.nombre = element.nombre;
                        elementadd.idCaso = resultado;
                        elementadd.usuarioCrea = this.currentUser.cod_persona;
            
                        let formData: FormData = new FormData();
                        formData.append('adjunto', elementadd.archivo, elementadd.archivo.name);
                        formData.append('idcaso', elementadd.idCaso);
                        this.casoService.GuardarAdjunto(formData)
                        .pipe(first())
                        .subscribe(
                          resta => {
                            elementadd.ruta = resta.data;
                            this.casoService.GuardarDataAdjunto(elementadd)
                            .pipe(first())
                            .subscribe(
                              res => {},
                              error => {}
                            );
                          },
                          error => {}
                        );
                      }
                    });
                    this.AbrirMensaje('', 'La información se guardó correctamente. Caso # '+resultado, 'check');
                    this.Cancelar();
                  }
                  else {
                    this.AbrirMensaje('', 'La información se guardó correctamente. Caso # '+resultado, 'check');
                    this.Cancelar();
                  }
                } else {
                  this.AbrirMensaje('', 'La información se guardó correctamente. Caso # '+resultado, 'check');
                  this.Cancelar();
                }
              },
              error => {
                this.endloading = true;
                this.AbrirMensaje('', 'Ocurrió un error al procesar la solicitud.', 'warning');
              }
            );
          }
          else {
            this.endloading = true;
            this.stepper.selectedIndex = 2;
            this.basicaForm.updateValueAndValidity();
            this.AbrirMensaje('', 'Campos marcados con asterísco (*) de la víctima son necesarios', 'pan_tool');
          }
        }
        else{
          this.endloading = true;
          this.stepper.selectedIndex = 1;
          this.basicaForm.updateValueAndValidity();
          this.AbrirMensaje('', 'Campos marcados con asterísco (*) del denunciante son necesarios', 'pan_tool');
        }
      } else {
        this.endloading = true;
        this.stepper.selectedIndex = 0;
        this.basicaForm.updateValueAndValidity();
        this.AbrirMensaje('', 'Campos marcados con asterísco (*) son necesarios', 'pan_tool');
      }

    }

    crearInfoPersona() {
      const infopersona: any = {
        IdGenero: this.denuncianteForm.controls.sexo.value,
        IdTipoIdentificacion: this.denuncianteForm.controls.tipodocumento.value,
        NumeroIdentificacion: this.denuncianteForm.controls.numerodocumento.value,
        Nombres: this.denuncianteForm.controls.nombres.value,
        Apellidos: this.denuncianteForm.controls.apellidos.value,
        FechaNacimiento: this.denuncianteForm.controls.fechanacimiento.value,
        Telefono: this.denuncianteForm.controls.telefono.value,
        Celular: this.denuncianteForm.controls.celular.value,
        Direccion: this.denuncianteForm.controls.direccion.value,
        Correo: this.denuncianteForm.controls.email.value,
        Observaciones: ''
      };
    }

    // Mueve el scroll de la pantalla a su parte superior
    goTop() {
      // document.body.scrollTop = document.documentElement.scrollTop = 0;
      // window.scrollTo(0, 0);
      this.document.body.scrollTop = 0;
    }

  loadImageDisabled(init: boolean) {
    if (this.denuncianteForm.controls.sexo.value === 1) {
      this.ImagenFrente = '../../assets/img/female-id-front-disable.png';
    } else if (this.denuncianteForm.controls.sexo.value === 2) {
      this.ImagenFrente = '../../assets/img/male-id-front-disable.png';
    } else {
      this.ImagenFrente = '../../assets/img/neutral-id-front-disable.png';
    }

    if (init !== true) {
      this.renderer.addClass(this.ImgFrente.nativeElement, 'flipInY');
      setTimeout(() => {
        this.renderer.removeClass(this.ImgFrente.nativeElement, 'flipInY');
      }, 1250);
    }
  }

  loadImageEnabled() {
    this.endloadingfoto = true;
      if (this.denuncianteForm.controls.sexo.value === 1) {
        this.ImagenFrente = '../../assets/img/female-id-front-enable.png';
      } else if (this.denuncianteForm.controls.sexo.value === 2) {
        this.ImagenFrente = '../../assets/img/male-id-front-enable.png';
      } else {
        this.ImagenFrente = '../../assets/img/neutral-id-front-enaable.png';
      }
      this.renderer.addClass(this.ImgFrente.nativeElement, 'flipInY');
      setTimeout(() => {
        this.renderer.removeClass(this.ImgFrente.nativeElement, 'flipInY');
      }, 2000);
  }

  agregarFotoDocumento(cara: any) {
    if (cara === 1) {
      this.callSelectedFile(true);
    } else if (cara === 2) {
      this.callSelectedFile(false);
    }
  }

  quitarFotoDocumento(cara: any) {
    if (cara === 1) {
      // this.photoFrontFile = undefined;
      this.loadImageDisabled(false);
    } else if (cara === 2) {
      // this.photoBackFile = undefined;
      this.ImagenAtras = '../../assets/img/id-back-disable.png';
      this.renderer.addClass(this.ImgAtras.nativeElement, 'flipInY');
      setTimeout(() => {
        this.renderer.removeClass(this.ImgAtras.nativeElement, 'flipInY');
      }, 1250);
    }
  }

  callSelectedFile(esfrente: boolean) {
    if (esfrente === true) {
      this.isloadfrontimg = true;
    } else {
      this.isloadfrontimg = false;
    }
    const el: HTMLElement = this.imageInput.nativeElement;
    el.click();
  }

  selectFile(event: any) {
    let fileName: any;
    this.file = event.target.files[0];
    fileName = this.file['name'];
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (eventt: any) => {
        this.localUrl = eventt.target.result;
        this.newCompressFile(this.localUrl, fileName);
      };
      reader.readAsDataURL(event.target.files[0]);
      this.adjuntoForm.controls.archivo.setValue(fileName);
    }
  }

  newCompressFile(image, fileName) {
    const imageBlob = this.newdataURItoBlob(image.split(',')[1]);
    const ptype = image.split(',')[0].split(';')[0].split(':')[1];
    // imageFile created below is the new compressed file which can be send to API in form data
    this.archivoadjunto = new File([imageBlob], fileName, { type: ptype });
    this.localmimetype = ptype;
  }

  newdataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
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

  iraLogin() {
    this.authenticationService.logout();
    this.router.navigate(['/ingreso']);
  }
}
