import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManufacturersPage } from './manufacturers.page';

describe('ManufacturersPage', () => {
  let component: ManufacturersPage;
  let fixture: ComponentFixture<ManufacturersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
