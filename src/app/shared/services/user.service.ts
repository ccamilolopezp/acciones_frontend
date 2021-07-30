import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../models/Usuario-Model';

@Injectable({ providedIn: 'root' })
export class UserService {

    private headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private http: HttpClient) { }

    public getAllUsers(user: UsuarioModel): Observable<UsuarioModel[]> {
      return this.http.post<any>(`${environment.apiUrl}/usuario/consultarusuariosistema`, user);
    }

    public getUserAD(user: UsuarioModel): Observable<UsuarioModel[]> {
      return this.http.post<any>(`${environment.apiUrl}/usuario/consultarusuarioad`, user);
    }

    public saveUser(user: UsuarioModel) {
      return this.http.post(`${environment.apiUrl}/usuario/asociarusuario`, user);
    }

    public registerCompany(item: any) {
      return this.http.post(`${environment.apiUrl}/login/registercompany`, item);
    }

    getAll() {
        return this.http.get<UsuarioModel[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/users/${id}`);
    }

    register(user: UsuarioModel) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    update(user: UsuarioModel) {
        return this.http.put(`${environment.apiUrl}/users/${user.cod_persona}`, user);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }
}
