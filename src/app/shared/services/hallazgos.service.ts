import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HallazgoModel } from '../models/Hallazgo-Model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosHallazgos {

  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  public rError: string;

  constructor(private http: HttpClient) { }

  public GuardarHallazgo(itemadd: HallazgoModel): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}hallazgos/guardar/`, itemadd);
  }

  public ListarHallazgos(filtros: any): Observable<HallazgoModel[]> {
    return this.http.post<HallazgoModel[]>(
      `${environment.apiUrl}hallazgos/listar/`, filtros, {headers: this.headers}
      );
  }
}

