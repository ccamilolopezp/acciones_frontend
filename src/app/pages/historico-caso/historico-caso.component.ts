import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CasoModel } from '@app/shared/models/Caso-Model';
import { ServiciosCasos } from '@app/shared/services/caso.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-historico-caso',
  templateUrl: './historico-caso.component.html',
  styleUrls: ['./historico-caso.component.css']
})
export class HistoricoCasoComponent implements OnInit {

  idcaso: any;
  listado: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<HistoricoCasoComponent>,
    private casoServicio: ServiciosCasos
  ) {
    if (data) {
      this.idcaso = data.idcaso;
    } else {
      this.CerrarModal();
    }
  }

  ngOnInit() {
    this.TraerHistorico();
  }

  TraerHistorico(){
    const filter: CasoModel = new CasoModel();
    filter.id = this.data.idcaso;
    this.casoServicio.ListarHistoricoCaso(filter)
    .pipe(first())
    .subscribe(
      res => {
        if (res['data'] !== null) {
          this.listado = res['data'];
          this.ValidarDatos();
        } else {
          this.CerrarModal();
        }
      },
      error => {
        this.CerrarModal();
    });
  }

  ValidarDatos() {
    this.listado.forEach(element => {
      element.objdetalle = JSON.parse(element.detalleEvento)
    });
  }

  CerrarModal(){
    this.dialogRef.close();
  }

}
