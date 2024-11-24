import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaFormularioComponent } from './formulario.component';

describe('CategoriaFormularioComponent', () => {
  let component: CategoriaFormularioComponent;
  let fixture: ComponentFixture<CategoriaFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
