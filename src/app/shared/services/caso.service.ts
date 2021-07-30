import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CasoModel } from '../models/Caso-Model';
import { AdjuntoModel } from '../models/Adjunto-Model';
import { NotaModel } from '../models/Nota-Model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosCasos {

  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  public rError: string;

  constructor(private http: HttpClient) { }

  public GuardarCaso(itemadd: CasoModel): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}casos/guardarcaso/`, itemadd);
  }

  public ListarCasosFiltro(filtros: CasoModel): Observable<CasoModel[]> {
    return this.http.post<CasoModel[]>(
      `${environment.apiUrl}casos/consultarcasosfiltro/`, filtros, {headers: this.headers}
      );
  }

  public ListarMisCasosFiltro(filtros: CasoModel): Observable<CasoModel[]> {
    return this.http.post<CasoModel[]>(
      `${environment.apiUrl}casos/consultarmiscasosfiltro/`, filtros, {headers: this.headers}
      );
  }

  public ListarHistoricoCaso(filtros: CasoModel): Observable<CasoModel[]> {
    return this.http.post<CasoModel[]>(
      `${environment.apiUrl}casos/consultarhistoricocaso/`, filtros, {headers: this.headers}
      );
  }

  public ListarCasosGrupoFiltro(filtros: CasoModel): Observable<CasoModel[]> {
    return this.http.post<CasoModel[]>(
      `${environment.apiUrl}casos/consultarcasosgrupofiltro/`, filtros, {headers: this.headers}
      );
  }

  public GuardarAdjunto(adjunto: FormData): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}casos/guardaradjunto/`, adjunto);
  }

  public GuardarDataAdjunto(adjunto: AdjuntoModel): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}casos/guardarinfoadjunto/`, adjunto);
  }
  
  // public DescargarAdjunto(adjunto: AdjuntoModel): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}login/descargaradjunto/${adjunto.id}`)
  // }

  // public DescargarAdjunto(adjunto: AdjuntoModel): Observable<any> {
  //   return this.http.get<any>(`${environment.apiUrl}login/descargaradjunto/${adjunto.id}`)
  // }

  public DescargarAdjunto(adjunto: AdjuntoModel): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}login/descargaradjunto/`, adjunto.id)
  }

  public GuardarDataNota(nota: NotaModel): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}casos/guardarinfonota/`, nota);
  }
  
}

