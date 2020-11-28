import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModeofpaymentPage } from './modeofpayment.page';

describe('ModeofpaymentPage', () => {
  let component: ModeofpaymentPage;
  let fixture: ComponentFixture<ModeofpaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeofpaymentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModeofpaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
