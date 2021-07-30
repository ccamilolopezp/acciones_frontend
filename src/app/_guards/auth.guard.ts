import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
          // if (currentUser.roleName.trim() === 'Encuestador') {
          //   if (route.routeConfig.path !== '' && route.routeConfig.path !== 'registro-encuesta') {
          //     this.router.navigate(['/noautorizado']);
          //   }
          //   // console.log(route);
          //   // this.router.navigate(['/']);
          //   // return false;
          // }
          return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/ingreso'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
