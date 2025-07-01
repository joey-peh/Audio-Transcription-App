import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Transcription } from '../../shared/models/transcription.model';

export const TranscriptionActions = createActionGroup({
  source: 'Transcription',
  events: {
    loadTranscriptions: emptyProps(),
    loadTranscriptionsSuccess: props<{ transcriptions: Transcription[] }>(),
    loadTranscriptionsFailure: props<{ error: string }>(),

    searchTranscriptions: props<{ filename: string }>(),
    searchTranscriptionsSuccess: props<{ results: Transcription[] }>(),
    searchTranscriptionsFailure: props<{ error: string }>(),

    addTranscription: props<{ files: File[] }>(),
    addTranscriptionSuccess: props<{ transcription: Transcription[] }>(),
    addTranscriptionFailure: props<{ error: string }>(),
  },
});
