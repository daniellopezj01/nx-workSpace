import { ToAnyPipe } from './to-any.pipe';

describe('ToAnyPipe', () => {
  it('create an instance', () => {
    const pipe = new ToAnyPipe();
    expect(pipe).toBeTruthy();
  });
});
