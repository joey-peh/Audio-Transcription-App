import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transcription } from '../shared/models/transcription.model';

@Injectable({
  providedIn: 'root',
})
export class TranscriptionService {
  private apiUrl = 'http://127.0.0.1:5000';

  private http = inject(HttpClient);

  getTranscriptions(): Observable<Transcription[]> {
    return this.http.get<Transcription[]>(`${this.apiUrl}/transcriptions`);
  }

  searchTranscriptions(filename: string): Observable<Transcription[]> {
    let params = new HttpParams();

    if (filename && filename.trim().length > 0) {
      params = params.append('filename', filename.trim());
    }
    return this.http.get<Transcription[]>(`${this.apiUrl}/search`, { params });
  }

  transcribeAudio(files: File[]): Observable<Transcription[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('audio', file);
    });

    return this.http.post<Transcription[]>(
      `${this.apiUrl}/transcribe`,
      formData
    );
  }
}
