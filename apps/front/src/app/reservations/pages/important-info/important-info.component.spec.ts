import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantInfoComponent } from './important-info.component';

describe('ImportantInfoComponent', () => {
  let component: ImportantInfoComponent;
  let fixture: ComponentFixture<ImportantInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportantInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportantInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
