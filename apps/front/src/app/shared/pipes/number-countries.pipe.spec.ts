import { NumberCountriesPipe } from './number-countries.pipe';

describe('NumberCountriesPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberCountriesPipe();
    expect(pipe).toBeTruthy();
  });
});
