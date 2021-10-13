import { CountDownTimePipe } from './count-down-time.pipe';

describe('CountDownTimePipe', () => {
  it('create an instance', () => {
    const pipe = new CountDownTimePipe();
    expect(pipe).toBeTruthy();
  });
});
