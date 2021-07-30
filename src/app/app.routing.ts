import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { AuthGuard } from './_guards';
import { NoautorizadoComponent } from './pages/noautorizado/noautorizado.component';
import { AdministradorComponent } from './pages/administrador/administrador.component';
import { SolicitudesServicioComponent } from './pages/solicitudes-servicio/solicitudes-servicio.component';
import { CrearSolicitudServicioComponent } from './pages/crear-solicitud-servicio/crear-solicitud-servicio.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { CrearUsuarioComponent } from './pages/crear-usuario/crear-usuario.component';
import { VisorReportesComponent } from './pages/visor-reportes/visor-reportes.component';
import { HallazgosComponent } from './pages/hallazgos/hallazgos.component';
import { CrearHallazgoComponent } from './pages/crear-hallazgo/crear-hallazgo.component';


const appRoutes: Routes = [
    // { path: '', component: HomeComponent,
    //  canActivate: [AuthGuard]
    // },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'no-autorizado', component: NoautorizadoComponent },
    { path: 'ingreso', component: LoginComponent },
    // { path: 'administrador', component: AdministradorComponent, canActivate: [AuthGuard] },
    { path: 'administrador', component: AdministradorComponent, canActivate: [AuthGuard] },
    { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
    { path: 'solicitudes-servicio', component: SolicitudesServicioComponent, canActivate: [AuthGuard] },
    { path: 'crear-solicitud-servicio', component: CrearSolicitudServicioComponent, canActivate: [AuthGuard] },
    { path: 'crear-usuario', component: CrearUsuarioComponent, canActivate: [AuthGuard] },
    { path: 'visualizar-reporte', component: VisorReportesComponent, canActivate: [AuthGuard] },
    { path: 'hallazgos', component: HallazgosComponent, canActivate: [AuthGuard] },
    { path: 'crear-hallazgo', component: CrearHallazgoComponent, canActivate: [AuthGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
