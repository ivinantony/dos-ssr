import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CancelorderPage } from './cancelorder.page';

describe('CancelorderPage', () => {
  let component: CancelorderPage;
  let fixture: ComponentFixture<CancelorderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelorderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelorderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
