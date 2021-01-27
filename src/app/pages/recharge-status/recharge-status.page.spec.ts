import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RechargeStatusPage } from './recharge-status.page';

describe('RechargeStatusPage', () => {
  let component: RechargeStatusPage;
  let fixture: ComponentFixture<RechargeStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargeStatusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RechargeStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
