import { Transcription } from '../../shared/models/transcription.model';

export interface TranscriptionState {
  transcriptions: Transcription[];
  error: string | null;
  searchResults: Transcription[];
  searchQuery: { filename: string };
  loading: boolean;
}

export const initialTranscriptionState: TranscriptionState = {
  transcriptions: [],
  error: null,
  searchResults: [],
  searchQuery: { filename: '' },
  loading: false
};
