import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TestModule } from './testing/test.module';

describe('App', () => {
  beforeEach(async () => {
    await TestModule.configureTestingModule();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
