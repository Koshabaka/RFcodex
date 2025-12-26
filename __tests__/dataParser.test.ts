import rawCivil from '../data/raw/civil_code.json';
import rawCriminal from '../data/raw/criminal_code.json';
import catalog from '../data/dist/catalog.json';
import {Catalog} from '../src/data/types';

describe('data parser', () => {
  it('keeps metadata and chapters from raw files', () => {
    const typed = catalog as Catalog;
    const civil = typed.codes.find(code => code.metadata.id === rawCivil.metadata.id);
    expect(civil?.chapters[0].articles[0].title).toBe(
      rawCivil.chapters[0].articles[0].title
    );
    const criminal = typed.codes.find(code => code.metadata.id === rawCriminal.metadata.id);
    expect(criminal?.metadata.abbreviation).toBe(rawCriminal.metadata.abbreviation);
  });
});
