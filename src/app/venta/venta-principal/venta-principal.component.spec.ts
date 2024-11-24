import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaPrincipalComponent } from './venta-principal.component';

describe('VentaPrincipalComponent', () => {
  let component: VentaPrincipalComponent;
  let fixture: ComponentFixture<VentaPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentaPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentaPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
