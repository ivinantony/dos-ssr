import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletPayPage } from './wallet-pay.page';

describe('WalletPayPage', () => {
  let component: WalletPayPage;
  let fixture: ComponentFixture<WalletPayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletPayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletPayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
