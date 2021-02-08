import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShippingpolicyPage } from './shippingpolicy.page';

describe('ShippingpolicyPage', () => {
  let component: ShippingpolicyPage;
  let fixture: ComponentFixture<ShippingpolicyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingpolicyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingpolicyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
