import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearHallazgoComponent } from './crear-hallazgo.component';

describe('CrearHallazgoComponent', () => {
  let component: CrearHallazgoComponent;
  let fixture: ComponentFixture<CrearHallazgoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearHallazgoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearHallazgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
