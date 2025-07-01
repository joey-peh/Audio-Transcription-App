import { Component, Input } from '@angular/core';
import { Transcription } from '../../shared/models/transcription.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-result',
  standalone: false,
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent {
  @Input() results: Transcription[] = [];
  @Input() searched: boolean = true;
  @Input() resultsHeader?: string;

  getDisplayedHeader(): string {
    return this.resultsHeader ?? `Found ${this.results.length} results`;
  }
  pageSize = 5;
  currentPage = 0;
  startIndex = 0;
  endIndex = this.pageSize;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
