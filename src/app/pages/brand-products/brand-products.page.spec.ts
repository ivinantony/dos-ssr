import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BrandProductsPage } from './brand-products.page';

describe('BrandProductsPage', () => {
  let component: BrandProductsPage;
  let fixture: ComponentFixture<BrandProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
