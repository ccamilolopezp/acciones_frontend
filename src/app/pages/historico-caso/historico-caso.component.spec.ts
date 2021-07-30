import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoCasoComponent } from './historico-caso.component';

describe('HistoricoCasoComponent', () => {
  let component: HistoricoCasoComponent;
  let fixture: ComponentFixture<HistoricoCasoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoCasoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoCasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
