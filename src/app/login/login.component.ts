import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

import * as $ from 'jquery';
import { AlertService, AuthenticationService } from '@app/_services';
import { AuthenticationRealService } from '@app/shared/services/authenticationreal.service';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '@app/shared/components/alert-dialog/alert-dialog.component';
import { ConfirmationDialog } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { UserService } from '@app/shared/services/user.service';
import { UsuarioModel } from '@app/shared/models/Usuario-Model';


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    // @ViewChild('cardlogin', null) cardlogin: ElementRef;

    msgErrorIngreso = '';
    msgErrorRecuperarClave = '';

    widthtest: string;
    displayimg: string;
    loginForm: FormGroup;
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    resultado: any;

    mpbcolor = 'primary';
    mpbmode = 'indeterminate';
    mpbvalue = 50;
    mpbbufferValue = 75;

    public divlogi = false;
    public divregi = false;
    public divthan = false;
    public divoffs = false;
    public divgetpass = false;
    public divload = true;

    correoCtrl = new FormControl(null, [Validators.required]);

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private authRealService: AuthenticationRealService,
        private alertService: AlertService,
        private emergente: MatDialog,
        // private renderer: Renderer2,
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.widthtest = '32%';
        this.displayimg = 'block';

        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            numidcompany: [''],
            // numidcompany: ['', Validators.required],
        });

        this.registerForm = this.formBuilder.group({
          companyname: ['', Validators.required],
          companyidnumber: ['', Validators.required],
          companycityid: [''],
          companyaddress: ['', Validators.required],
          companyphone: ['', Validators.required],
          useremail: ['', Validators.required],
          userpassword: ['', Validators.required],
          repeatpassword: ['', Validators.required],
        });

        // tslint:disable-next-line: deprecation
        $(document).ready(
          // tslint:disable-next-line:only-arrow-functions
          function() {
          const images = ['Login-Dashboard01.jpg',
                          'Login-Dashboard02.jpg',
                          'Login-Dashboard03.jpg',
                          'Login-Dashboard04.jpg',
                          'Login-Dashboard05.jpg'];

          $('#imgLog').attr('src', 'assets/img/login/' + images[Math.floor(Math.random() * images.length)]);
        });

        setTimeout(() => {
          this.divlogi = true;
          this.divload = false;
        }, 5000);

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    // onSubmit() {
    //   this.router.navigate([this.returnUrl]);
    // }

    onSubmit() {
      this.msgErrorIngreso = '';
      this.submitted = true;

      // No continúa si los campos no son válidos
      if (this.loginForm.invalid) { return; }

      const pModel = {
        username: this.f.username.value,
        Clave: this.f.password.value,
      };

      this.loginForm.controls.username.disable();
      this.loginForm.controls.password.disable();

      this.loading = true;

      this.authenticationService.login(pModel)
      .subscribe(
        data => {
          this.loading = false;
          this.loginForm.controls.username.enable();
          this.loginForm.controls.password.enable();
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.loading = false;
          this.loginForm.controls.username.enable();
          this.loginForm.controls.password.enable();
          if (error === 'Error Credenciales') {
            this.msgErrorIngreso = '*Credenciales no coinciden.';
          } else {
            this.msgErrorIngreso = 'Indisponibilidad de servicios.';
          }
      });
    }

    saveRegister(): void {
      if (this.registerForm.valid) {
        if (this.registerForm.get('userpassword').value === this.registerForm.get('repeatpassword').value) {
          this.loading = true;
          this.userService.registerCompany(this.registerForm.value)
          .pipe(first())
          .subscribe(
            res => {
                this.resultado = res['data'];
                this.loading = false;
                if (this.resultado === 'true' || this.resultado === true) {
                  this.goLogin();
                  this.openAlertDialog('Registro realizado correctamente.');
                } else {
                  this.openAlertDialog('La empresa ya esta registrada.');
                }
            },
            error => {
                this.loading = false;
            }
          );
        } else {
          this.registerForm.get('userpassword').setValue('');
          this.registerForm.get('repeatpassword').setValue('');
          this.registerForm.updateValueAndValidity();
          return;
        }
      } else {
        this.registerForm.updateValueAndValidity();
        return;
      }
    }

    openConfirmationDialog() {
      const dialogRef = this.emergente.open(ConfirmationDialog, {
        data: {
          message: 'Are you sure want to delete?',
          buttonText: {
            ok: 'Save',
            cancel: 'No'
          }
        }
      });
   }

    openAlertDialog(mensaje: any) {
      const dialogRef = this.emergente.open(AlertDialogComponent, {
        data: {
          message: mensaje,
          buttonText: {
            cancel: 'Cerrar'
          }
        },
        disableClose: true
      });
    }

    goRegister() {
      this.cleanRegister();
      this.divregi = true;
      this.divlogi = false;
    }

    goLogin() {
      this.divregi = false;
      this.divlogi = true;
    }

    cleanRegister() {
      this.registerForm.get('companyname').setValue('');
      this.registerForm.get('companyidnumber').setValue('');
      this.registerForm.get('useremail').setValue('');
      this.registerForm.get('userpassword').setValue('');
    }

    // Valida selección en input de autocompletar
    displayWith(obj?: any): string | undefined {
      return obj ? obj.name : undefined;
    }

    RecordarClave() {
      this.loading = false;
      this.divload = false;
      this.divoffs = false;
      this.divlogi = false;
      this.divgetpass = true;
    }

    IraIngreso() {
      this.loading = false;
      this.divload = false;
      this.divoffs = false;
      this.divlogi = true;
      this.divgetpass = false;
    }

    EnviarClave(){}

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
}
