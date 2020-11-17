import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OtpmodalPage } from './otpmodal.page';

describe('OtpmodalPage', () => {
  let component: OtpmodalPage;
  let fixture: ComponentFixture<OtpmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpmodalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OtpmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
