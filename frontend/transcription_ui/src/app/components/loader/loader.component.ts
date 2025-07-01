import { Component, inject } from '@angular/core';
import { selectLoading } from '../../store/reducers/transcription.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {
  private store = inject(Store);
  isLoading$ = this.store.select(selectLoading);
}
