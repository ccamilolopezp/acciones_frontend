import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleModel } from '../models/role-model';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class RoleService {

    private headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private http: HttpClient) { }

    public getAll(): Observable<RoleModel[]> {
      return this.http.get<any>(`${environment.apiUrl}/roles/consultarroles`);
    }

    public save(role: RoleModel) {
      return this.http.post(`${environment.apiUrl}/roles/crearrole`, role);
    }

    public remove(role: RoleModel) {
      return this.http.post(`${environment.apiUrl}/roles/eliminarrole`, role);
    }
}
