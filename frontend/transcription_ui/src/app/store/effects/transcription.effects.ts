import { inject, Injectable } from '@angular/core';
import { mergeMap, map, catchError, of } from 'rxjs';
import { TranscriptionActions } from '../actions/transcription.action';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranscriptionService } from '../../services/transcription.service';

@Injectable()
export class TranscriptionEffects {
  private actions$ = inject(Actions);
  private transcriptionService = inject(TranscriptionService);

  loadTranscriptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TranscriptionActions.loadTranscriptions),
      mergeMap(() =>
        this.transcriptionService.getTranscriptions().pipe(
          map((transcriptions) =>
            TranscriptionActions.loadTranscriptionsSuccess({ transcriptions })
          ),
          catchError((error) =>
            of(
              TranscriptionActions.loadTranscriptionsFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  searchTranscriptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TranscriptionActions.searchTranscriptions),
      mergeMap(({ filename }) =>
        this.transcriptionService.searchTranscriptions(filename).pipe(
          map((results) =>
            TranscriptionActions.searchTranscriptionsSuccess({
              results,
            })
          ),
          catchError((error) =>
            of(
              TranscriptionActions.searchTranscriptionsFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  addTranscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TranscriptionActions.addTranscription),
      mergeMap(({ files }) =>
        this.transcriptionService.transcribeAudio(files).pipe(
          map((transcription) =>
            TranscriptionActions.addTranscriptionSuccess({ transcription })
          ),
          catchError((error) =>
            of(
              TranscriptionActions.addTranscriptionFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );
}
