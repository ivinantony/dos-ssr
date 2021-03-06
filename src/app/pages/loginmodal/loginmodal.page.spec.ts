import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginmodalPage } from './loginmodal.page';

describe('LoginmodalPage', () => {
  let component: LoginmodalPage;
  let fixture: ComponentFixture<LoginmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginmodalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
