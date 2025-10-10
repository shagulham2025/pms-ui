import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPropertiesComponent } from './add-edit-properties-component';

describe('AddEditPropertiesComponent', () => {
  let component: AddEditPropertiesComponent;
  let fixture: ComponentFixture<AddEditPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPropertiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
