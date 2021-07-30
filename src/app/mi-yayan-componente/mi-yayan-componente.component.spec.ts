import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiYayanComponenteComponent } from './mi-yayan-componente.component';

describe('MiYayanComponenteComponent', () => {
  let component: MiYayanComponenteComponent;
  let fixture: ComponentFixture<MiYayanComponenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiYayanComponenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiYayanComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
