import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material';
import { async } from 'q';
import { UsuarioModel } from './shared/models/Usuario-Model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    currentUser: UsuarioModel;
    currentUserSubscription: Subscription;

    endloading = false;

    mpbcolor = 'primary';
    mpbmode = 'indeterminate';
    mpbvalue = 50;
    mpbbufferValue = 75;

    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    @ViewChild('drawer', null) sidenav: MatSidenav;
    toggleSidenav() {
      this.sidenav.toggle();
    }

    verificar(algo: any) {
      // console.log(algo);
    }

    constructor(
        private breakpointObserver: BreakpointObserver,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
        this.currentUser = user;
        });
        setTimeout(() => {
          this.endloading = true;
        }, 3000);
        // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    // ngOnInit() {
    //   console.log(this.currentUser);
    //   if (this.currentUser) {
    //     if (this.currentUser.roleName === 'Encuestador') {
    //       this.esEncuestador = true;
    //     } else {
    //       this.esEncuestador = false;
    //     }
    //   }
    //   console.log(this.esEncuestador = true);
    // }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/ingreso']);
    }
}
