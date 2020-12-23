import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReturnandrefundPage } from './returnandrefund.page';

describe('ReturnandrefundPage', () => {
  let component: ReturnandrefundPage;
  let fixture: ComponentFixture<ReturnandrefundPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnandrefundPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnandrefundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
