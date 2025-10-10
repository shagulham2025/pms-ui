import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDocterDetailComponent } from './all-docter-detail-component';

describe('AllDocterDetailComponent', () => {
  let component: AllDocterDetailComponent;
  let fixture: ComponentFixture<AllDocterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDocterDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDocterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
