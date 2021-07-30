import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorReportesComponent } from './visor-reportes.component';

describe('VisorReportesComponent', () => {
  let component: VisorReportesComponent;
  let fixture: ComponentFixture<VisorReportesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisorReportesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
