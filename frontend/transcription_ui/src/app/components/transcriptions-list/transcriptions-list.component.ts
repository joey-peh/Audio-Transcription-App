import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranscriptionActions } from '../../store/actions/transcription.action';
import { selectAllTranscriptions } from '../../store/reducers/transcription.reducer';
import { map, Subscription } from 'rxjs';
import { Transcription } from '../../shared/models/transcription.model';

@Component({
  selector: 'app-transcriptions-list',
  standalone: false,
  templateUrl: './transcriptions-list.component.html',
  styleUrl: './transcriptions-list.component.css',
})
export class TranscriptionsListComponent {
  private store = inject(Store);
  private subs = new Subscription();

  transcriptionList$ = this.store.select(selectAllTranscriptions);
  transcriptionList: Transcription[] = [];
  filteredTranscriptions: Transcription[] = [];

  ngOnInit(): void {
    this.store.dispatch(TranscriptionActions.loadTranscriptions());
    this.subs.add(
      this.transcriptionList$.subscribe((transcriptions) => {
        this.transcriptionList = transcriptions;
        this.filteredTranscriptions = [...transcriptions];
      })
    );
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    if (!filterValue) {
      this.filteredTranscriptions = [...this.transcriptionList];
      return;
    }

    this.filteredTranscriptions = this.transcriptionList.filter(
      (t) =>
        t.text.toLowerCase().includes(filterValue) ||
        (t.filename && t.filename.toLowerCase().includes(filterValue))
    );
  }
}
