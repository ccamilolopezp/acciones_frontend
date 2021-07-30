import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSolicitudServicioComponent } from './crear-solicitud-servicio.component';

describe('CrearSolicitudServicioComponent', () => {
  let component: CrearSolicitudServicioComponent;
  let fixture: ComponentFixture<CrearSolicitudServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearSolicitudServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearSolicitudServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
