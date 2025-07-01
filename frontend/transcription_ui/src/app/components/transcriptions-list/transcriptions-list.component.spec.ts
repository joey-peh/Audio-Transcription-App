import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionsListComponent } from './transcriptions-list.component';
import { TestModule } from '../../testing/test.module';

describe('TranscriptionsListComponent', () => {
  let component: TranscriptionsListComponent;
  let fixture: ComponentFixture<TranscriptionsListComponent>;

  beforeEach(async () => {
    await TestModule.configureTestingModule({
      declarations: [TranscriptionsListComponent]
    })
    
    fixture = TestBed.createComponent(TranscriptionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
