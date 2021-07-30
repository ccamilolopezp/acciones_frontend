export class UsuarioModel {
  cod_persona: number;
  numero_documento : number;
  nombre: string;
  apellido: string;
  username: string;
  id_perfil: number;
  Clave: string;
  TokenJWT: string;
  Perfiles: Array<string>;
}
