import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynopsisDialog } from './synopsis-dialog';

describe('SynopsisDialog', () => {
  let component: SynopsisDialog;
  let fixture: ComponentFixture<SynopsisDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SynopsisDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SynopsisDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
