import { ReverserPipe } from './reverser.pipe';

describe('ReverserPipe', () => {
  it('create an instance', () => {
    const pipe = new ReverserPipe();
    expect(pipe).toBeTruthy();
  });
});
