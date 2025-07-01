import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranscriptionActions } from '../../store/actions/transcription.action';
import {
  selectAllTranscriptions,
  selectError,
} from '../../store/reducers/transcription.reducer';
import { filter, pairwise, startWith, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Transcription } from '../../shared/models/transcription.model';

@Component({
  selector: 'app-upload',
  standalone: false,
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent implements OnInit {
  private store = inject(Store);
  private subs = new Subscription();
  private snackBar = inject(MatSnackBar);

  selectedFiles: File[] = [];
  errorMessage: string | null = null;
  uploadedTranscriptions: Transcription[] = [];

  transcriptionList$ = this.store.select(selectAllTranscriptions);
  errorList$ = this.store.select(selectError);

  ngOnInit(): void {
    this.subs.add(
      this.transcriptionList$
        .pipe(
          startWith([] as Transcription[]),
          pairwise(),
          filter(([prev, current]) => current.length > prev.length)
        )
        .subscribe(([prev, current]) => {
          //Compare previous and current value to get the new transcriptions newly added by user
          const newTranscriptions = current.slice(prev.length);
          this.checkForUploadedFiles(newTranscriptions);
        })
    );

    this.subs.add(
      this.errorList$.subscribe((error) => {
        if (error) {
          this.snackBar.open(
            'There is error, please try again later!',
            'Close',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        }
      })
    );
  }

  private checkForUploadedFiles(newTranscriptions: Transcription[]) {
    //Check if the new transcriptions matches the file user uploaded
    const relevantTranscriptions = newTranscriptions.filter((t) =>
      this.selectedFiles.map((x) => x.name).includes(t.filename)
    );

    if (relevantTranscriptions.length > 0) {
      this.uploadedTranscriptions = relevantTranscriptions;

      this.snackBar.open('Successfully Transcribed!', 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.resetUpload();
    }
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
  onFileSelect(event: any) {
    this.errorMessage = null;
    const files: FileList = event.target.files;

    if (!files || files.length === 0) return;

    //only accept audio files
    const newAudioFiles = Array.from(files).filter((file) => {
      const isAudio = file.type.startsWith('audio/');
      if (!isAudio) {
        this.errorMessage = 'Only audio files are allowed.';
        return false;
      }

      //ensure that there is no duplicate files selected
      const isDuplicate = this.selectedFiles.some(
        (existingFile) =>
          existingFile.name === file.name &&
          existingFile.size === file.size &&
          existingFile.lastModified === file.lastModified
      );

      if (isDuplicate) {
        this.errorMessage = `${file.name} is already selected.`;
        return false;
      }

      return true;
    });

    this.selectedFiles = [...this.selectedFiles, ...newAudioFiles];
    event.target.value = '';
  }

  uploadFiles() {
    if (this.selectedFiles.length === 0) {
      return;
    }

    this.store.dispatch(
      TranscriptionActions.addTranscription({ files: this.selectedFiles })
    );
  }

  resetUpload() {
    this.selectedFiles = [];
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }
}
