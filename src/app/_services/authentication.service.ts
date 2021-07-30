import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { UsuarioModel } from '@app/shared/models/Usuario-Model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<UsuarioModel>;
    public currentUser: Observable<UsuarioModel>;

    constructor(private http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<UsuarioModel>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): UsuarioModel {
      return this.currentUserSubject.value;
    }

    login(pItem: any) {
      return this.http.post<any>(`${environment.apiUrl}login/autenticar`, pItem)
          .pipe(map(user => {
              // login successful if there's a jwt token in the response
              console.log(user)
              console.log("Si obtuve respuesta del servidor")
              if (user && user.TokenJWT) {
                console.log("Si entre al if")
                const usuarioDB: UsuarioModel = {
                  cod_persona: user.cod_persona,
                  numero_documento: user.numero_documento,
                  nombre: user.nombre,
                  apellido: user.apellido,
                  username: user.username,
                  Clave: '',
                  TokenJWT: user.TokenJWT,
                  Perfiles: user.Perfiles,
                  id_perfil: user.id_perfil
                };

                console.log("Si cree usuarioDB")
                console.log(usuarioDB)
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(usuarioDB));
                console.log("Si guarde en localStorage")


                this.currentUserSubject.next(usuarioDB);

              }
              console.log("Salio del if")

              return user;
          }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('datosHistoricoAsociacion');
    localStorage.removeItem('ListasParametricas');
    localStorage.clear();
    this.currentUserSubject.next(null);
  }
}
