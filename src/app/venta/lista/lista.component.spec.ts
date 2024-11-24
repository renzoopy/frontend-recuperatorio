import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaListaComponent } from './lista.component';

describe('VentaListaComponent', () => {
  let component: VentaListaComponent;
  let fixture: ComponentFixture<VentaListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentaListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
