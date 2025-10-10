import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDocterComponent } from './add-edit-docter-component';

describe('AddEditDocterComponent', () => {
  let component: AddEditDocterComponent;
  let fixture: ComponentFixture<AddEditDocterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditDocterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDocterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
