import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranscriptionActions } from '../../store/actions/transcription.action';
import {
  selectSearchResults,
  selectError,
} from '../../store/reducers/transcription.reducer';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  private store = inject(Store);
  filenameSearch: string = '';

  searched = false;

  pageSize = 5;
  currentPage = 0;
  startIndex = 0;
  endIndex = this.pageSize;

  searchResults$ = this.store.select(selectSearchResults);
  error$ = this.store.select(selectError);

  onSearch() {
    this.store.dispatch(
      TranscriptionActions.searchTranscriptions({
        filename: this.filenameSearch,
      })
    );
    this.searched = true;
  }

  resetFilters() {
    this.filenameSearch = '';
    this.searched = false;
  }
  
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
