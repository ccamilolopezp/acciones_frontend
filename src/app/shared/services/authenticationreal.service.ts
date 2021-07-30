import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UsuarioModel } from '../models/Usuario-Model';

@Injectable({ providedIn: 'root' })
export class AuthenticationRealService {
    private currentUserSubject: BehaviorSubject<UsuarioModel>;
    public currentUser: Observable<UsuarioModel>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<UsuarioModel>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): UsuarioModel {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/login/authenticate`, { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.TokenJWT) {
                    const userls = {
                      id: user.Id,
                      username: user.Correo,
                      firstName: user.Nombres,
                      lastName: user.Apellidos,
                      token: user.TokenJWT
                  };
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(userls));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('dataConvocatorias');
        localStorage.removeItem('dataDetailSeach');
        localStorage.removeItem('dataEmpresas');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
