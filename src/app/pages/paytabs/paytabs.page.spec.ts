import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaytabsPage } from './paytabs.page';

describe('PaytabsPage', () => {
  let component: PaytabsPage;
  let fixture: ComponentFixture<PaytabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaytabsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaytabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
