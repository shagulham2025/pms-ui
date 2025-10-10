import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocterAvailabilityComponent } from './docter-availability-component';

describe('DocterAvailabilityComponent', () => {
  let component: DocterAvailabilityComponent;
  let fixture: ComponentFixture<DocterAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocterAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocterAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
