import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_components';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { LayoutComponent } from './layout/layout.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MyOwnCustomMaterialModule } from './shared/material.module';
import { AlertDialogComponent } from './shared/components/alert-dialog/alert-dialog.component';
import { ConfirmationDialog } from './shared/components/confirmation-dialog/confirmation-dialog.component';
import { NoautorizadoComponent } from './pages/noautorizado/noautorizado.component';
import { ChartsModule } from 'ng2-charts';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AdministradorComponent } from './pages/administrador/administrador.component';
import { SolicitudesServicioComponent } from './pages/solicitudes-servicio/solicitudes-servicio.component';
import { CrearSolicitudServicioComponent } from './pages/crear-solicitud-servicio/crear-solicitud-servicio.component';
import { SafeUrlPipe } from './shared/services/safe-url.pipe';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { CrearUsuarioComponent } from './pages/crear-usuario/crear-usuario.component';
import { HistoricoCasoComponent } from './pages/historico-caso/historico-caso.component';
import { ReportViewerModule } from 'ngx-ssrs-reportviewer';
import { VisorReportesComponent } from './pages/visor-reportes/visor-reportes.component';
import { HallazgosComponent } from './pages/hallazgos/hallazgos.component';
import { CrearHallazgoComponent } from './pages/crear-hallazgo/crear-hallazgo.component';;
import { MiYayanComponenteComponent } from './mi-yayan-componente/mi-yayan-componente.component'

@NgModule({
    imports: [
      BrowserModule,
      ReactiveFormsModule,
      FormsModule,
      HttpClientModule,
      routing,
      BrowserAnimationsModule,
      LayoutModule,
      FlexLayoutModule,
      MyOwnCustomMaterialModule,
      ChartsModule,
      MatGridListModule,
      MatCardModule,
      MatMenuModule,
      ReportViewerModule
    ],
    entryComponents: [
      AlertDialogComponent,
      ConfirmationDialog,
      HistoricoCasoComponent
    ],
    declarations: [
      AppComponent,
      AlertComponent,
      HomeComponent,
      LoginComponent,
      LayoutComponent,
      AlertDialogComponent,
      ConfirmationDialog,
      NoautorizadoComponent,
      AdministradorComponent ,
      SolicitudesServicioComponent,
      CrearSolicitudServicioComponent,
      SafeUrlPipe,
      UsuariosComponent,
      CrearUsuarioComponent,
      HistoricoCasoComponent,
      VisorReportesComponent,
      HallazgosComponent,
      CrearHallazgoComponent,
      MiYayanComponenteComponent
    ],
    providers: [
      NgxImageCompressService,
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
