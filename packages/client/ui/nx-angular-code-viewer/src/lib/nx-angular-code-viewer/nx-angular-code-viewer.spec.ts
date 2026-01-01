import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxAngularCodeViewer } from './nx-angular-code-viewer';

describe('NxAngularCodeViewer', () => {
  let component: NxAngularCodeViewer;
  let fixture: ComponentFixture<NxAngularCodeViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NxAngularCodeViewer],
    }).compileComponents();

    fixture = TestBed.createComponent(NxAngularCodeViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
