import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteDetailComponent } from './visite-detail.component';

describe('VisiteDetailComponent', () => {
  let component: VisiteDetailComponent;
  let fixture: ComponentFixture<VisiteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisiteDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisiteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
