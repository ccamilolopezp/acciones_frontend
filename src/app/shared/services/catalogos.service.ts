import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosCatalogos {

  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  public rError: string;

  constructor(private http: HttpClient) { }

  public ConsultaInfoParametrica(): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}catalogos/consultartodos/`, {headers: this.headers}
      );
  }
  
}

