import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AreaSearchPage } from './area-search.page';

describe('AreaSearchPage', () => {
  let component: AreaSearchPage;
  let fixture: ComponentFixture<AreaSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AreaSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
