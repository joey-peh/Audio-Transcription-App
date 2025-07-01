import { TestBed } from '@angular/core/testing';
import { TranscriptionService } from './transcription.service';
import { Transcription } from '../shared/models/transcription.model';
import { HttpParams, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestModule } from '../testing/test.module';

describe('TranscriptionService', () => {
  let service: TranscriptionService;
  let httpMock: HttpTestingController;
  const mockTranscriptions: Transcription[] = [
    {
      id: 1,
      filename: 'test1.mp3',
      text: 'Test transcription 1',
      created_at: 'Tue, 01 Jul 2025 13:58:44 GMT',
    },
    {
      id: 2,
      filename: 'test2.mp3',
      text: 'Test transcription 2',
      created_at: 'Tue, 01 Jul 2025 13:58:44 GMT',
    },
  ];

  beforeEach(() => {
    TestModule.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TranscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all transcriptions in getTranscriptions_Positive', () => {
    service.getTranscriptions().subscribe((transcriptions) => {
      expect(transcriptions.length).toBe(2);
      expect(transcriptions).toEqual(mockTranscriptions);
    });

    const req = httpMock.expectOne('http://127.0.0.1:5000/transcriptions');
    expect(req.request.method).toBe('GET');
    req.flush(mockTranscriptions);
  });

  it('should search transcriptions with filename parameter in searchTranscriptions_Positive', () => {
    const filename = 'test1.mp3';
    const expectedUrl = 'http://127.0.0.1:5000/search';
    const expectedParams = new HttpParams().append('filename', filename);

    service.searchTranscriptions(filename).subscribe((transcriptions) => {
      expect(transcriptions.length).toBe(1);
      expect(transcriptions[0].filename).toBe(filename);
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === expectedUrl &&
        request.params.get('filename') === filename
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys()).toEqual(expectedParams.keys());
    req.flush([mockTranscriptions[0]]);
  });
  
  it('should upload files for transcription in transcribeAudio_Positive', () => {
    const mockFile1 = new File(['audio content'], 'test1.mp3', {
      type: 'audio/mp3',
    });
    const mockFile2 = new File(['audio content'], 'test2.mp3', {
      type: 'audio/mp3',
    });
    const files = [mockFile1, mockFile2];

    service.transcribeAudio(files).subscribe((transcriptions) => {
      expect(transcriptions.length).toBe(2);
    });

    const req = httpMock.expectOne('http://127.0.0.1:5000/transcribe');
    expect(req.request.method).toBe('POST');

    // Check FormData content
    const formData: FormData = req.request.body;
    expect(formData.getAll('audio').length).toBe(2);
    expect(formData.getAll('audio')[0]).toEqual(mockFile1);
    expect(formData.getAll('audio')[1]).toEqual(mockFile2);

    req.flush(mockTranscriptions);
  });
});
