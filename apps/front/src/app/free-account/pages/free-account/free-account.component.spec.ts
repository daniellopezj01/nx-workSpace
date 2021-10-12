import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeAccountComponent } from './free-account.component';

describe('FreeAccountComponent', () => {
  let component: FreeAccountComponent;
  let fixture: ComponentFixture<FreeAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
