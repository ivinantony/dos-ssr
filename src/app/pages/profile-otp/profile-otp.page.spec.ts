import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileOTPPage } from './profile-otp.page';

describe('ProfileOTPPage', () => {
  let component: ProfileOTPPage;
  let fixture: ComponentFixture<ProfileOTPPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileOTPPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileOTPPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
