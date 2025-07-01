import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { TranscriptionActions } from '../actions/transcription.action';
import {
  initialTranscriptionState,
  TranscriptionState,
} from '../state/transcription.state';

export const transcriptionReducer = createReducer(
  initialTranscriptionState,

  on(TranscriptionActions.loadTranscriptions, (state) => ({
    ...state,
    error: null,
    loading: true,
  })),
  on(
    TranscriptionActions.loadTranscriptionsSuccess,
    (state, { transcriptions }) => ({
      ...state,
      transcriptions,
      loading: false,
    })
  ),
  on(TranscriptionActions.loadTranscriptionsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(TranscriptionActions.searchTranscriptions, (state, { filename }) => ({
    ...state,
    searchQuery: { filename },
    error: null,
    loading: true,
  })),
  on(
    TranscriptionActions.searchTranscriptionsSuccess,
    (state, { results }) => ({
      ...state,
      searchResults: results,
      loading: false,
    })
  ),
  on(TranscriptionActions.searchTranscriptionsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(TranscriptionActions.addTranscription, (state) => ({
    ...state,
    error: null,
    loading: true,
  })),
  on(
    TranscriptionActions.addTranscriptionSuccess,
    (state, { transcription }) => ({
      ...state,
      transcriptions: [...state.transcriptions, ...transcription],
      loading: false,
    })
  ),
  on(TranscriptionActions.addTranscriptionFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);


//Selectors
export const selectTranscriptionState =
  createFeatureSelector<TranscriptionState>('transcription');

export const selectAllTranscriptions = createSelector(
  selectTranscriptionState,
  (state: TranscriptionState) => state.transcriptions
);

export const selectSearchResults = createSelector(
  selectTranscriptionState,
  (state) => state?.searchResults || []
);

export const selectError = createSelector(
  selectTranscriptionState,
  (state) => state?.error || null
);

export const selectLoading = createSelector(
  selectTranscriptionState,
  (state: TranscriptionState) => state.loading
);
