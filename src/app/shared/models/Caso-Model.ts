import { AdjuntoModel } from "./Adjunto-Model";
import { NotaModel } from './Nota-Model';

export class CasoModel {
    id: number;
    idEstado: number;
    idGrupo: number;
    idServicio: number;
    idUsuarioAsignado: number;
    codUrgencia: number;
    idResultado: number;
    numIdentificacionDenunciante: string;
    nombreDenunciante: string;
    direccionDenunciante: string;
    emailDenunciante: string;
    telefonoDenunciante: string;
    contenidoPlantilla: string;
    contenidoSolucion: string;
    idUsuarioCreacion: number;
    fecCreacion: string;
    fecSolucion: string;
    numIdentificacionVictima: string;
    nombreVictima: string;
    direccionVictima: string;
    emailVictima: string;
    telefonoVictima: string;
    NombreCategoria: string;
    NombreServicio: string;
    NombreEstado: string;
    edadDenunciante: number;
    edadVictima: number;
    idLocalidadDenunciante: number;
    idLocalidadVictima: number;
    ListaAdjuntos: Array<AdjuntoModel>;
    ListaNotas: Array<NotaModel>;
}
