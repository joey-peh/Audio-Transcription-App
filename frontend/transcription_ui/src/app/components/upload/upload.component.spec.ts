import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadComponent } from './upload.component';
import { TestModule } from '../../testing/test.module';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestModule.configureTestingModule({
      declarations: [UploadComponent],
    });

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prevent duplicate files in onFileSelect_Positive', () => {
    const mockFile = new File(['audio'], 'test.mp3', { type: 'audio/mp3' });
    component.selectedFiles = [mockFile];

    const event = { target: { files: [mockFile] } };
    component.onFileSelect(event);

    expect(component.selectedFiles.length).toBe(1);
    expect(component.errorMessage).toContain('already selected');
  });
});
