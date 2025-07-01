import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { initialTranscriptionState } from '../store/state/transcription.state';

@NgModule({
  imports: [],
  exports: [],
  providers: [provideMockStore({ initialState: initialTranscriptionState })],
})
export class TestModule {
  static configureTestingModule(
    moduleDef: { declarations?: any[]; providers?: any[] } = {}
  ) {
    TestBed.configureTestingModule({
      imports: [
        TestModule, // Import self
      ],
      declarations: moduleDef.declarations || [],
      providers: [...(moduleDef.providers || [])],
      schemas: [NO_ERRORS_SCHEMA],
    });

    return {
      get store(): MockStore {
        return TestBed.inject(MockStore);
      },
      get storeInstance(): Store {
        return TestBed.inject(Store);
      },
    };
  }
}
