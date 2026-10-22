import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoEditar } from './producto-editar';

describe('ProductoEditar', () => {
  let component: ProductoEditar;
  let fixture: ComponentFixture<ProductoEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoEditar],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoEditar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
