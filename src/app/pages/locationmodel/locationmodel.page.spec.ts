import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationmodelPage } from './locationmodel.page';

describe('LocationmodelPage', () => {
  let component: LocationmodelPage;
  let fixture: ComponentFixture<LocationmodelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationmodelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationmodelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
