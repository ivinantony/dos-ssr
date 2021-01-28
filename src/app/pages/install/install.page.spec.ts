import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InstallPage } from './install.page';

describe('InstallPage', () => {
  let component: InstallPage;
  let fixture: ComponentFixture<InstallPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InstallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
