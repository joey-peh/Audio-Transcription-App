import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';
import { TestModule } from '../../testing/test.module';
import { MockStore } from '@ngrx/store/testing';
import { selectLoading } from '../../store/reducers/transcription.reducer';

describe('LoaderComponent', () => {
  let store: MockStore;
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(() => {
    TestModule.configureTestingModule({
      declarations: [LoaderComponent],
    });

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectLoading, false);

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
