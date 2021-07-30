import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { UserService, AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { UsuarioModel } from '@app/shared/models/Usuario-Model';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {
    currentUser: UsuarioModel;
    currentUserSubscription: Subscription;

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private router: Router,
    ) {
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
        this.currentUser = user;
      });
    }

    ngOnInit() {
      this.router.navigate(['/administrador']);
      // const datosPerfiles = this.currentUser.Perfiles;
      // // console.log(datosPerfiles);
      // if (datosPerfiles.filter(e => e === 'Asociado').length > 0) {
      //   this.router.navigate(['/asociado']);
      // } else if (datosPerfiles.filter(e => e === 'Admin').length > 0) {
      //   this.router.navigate(['/administrador']);
      // } else if (datosPerfiles.filter(e => e === 'SuperAdmin').length > 0) {
      //   this.router.navigate(['/super']);
      // } else if (datosPerfiles.filter(e => e === 'Aliado').length > 0) {
      //   this.router.navigate(['/aliado']);
      // }
    }

    ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      this.currentUserSubscription.unsubscribe();
    }
}
