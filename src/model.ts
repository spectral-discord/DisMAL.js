/**
 * This is an abstract class that all psychoacoustic
 * models should inherit from.
 */

import { Spectrum, Partial } from 'tsonify';

export interface Tone {
  spectrum: Spectrum,
  frequency: number,
  amplitudeMultiplier: number,
}

export abstract class Model {
  readonly name;
  readonly description;
  readonly type;

  constructor() {
    this.name = 'Model';
    this.description = 'An abstract base class that psychoacoustic models can inherit from.';
    this.type = 'Abstract';
  }

  abstract process(chord: Tone[]): number;
}

export abstract class SpectralInterferenceModel extends Model {
  readonly name;
  readonly description;
  readonly type;
  
  constructor() {
    super();

    this.name = 'Spectral Interference Model';
    this.description = 'An abstract base class that pure-dyad spectral interference models can inherit from.';
    this.type = 'Abstract';
  }

  abstract calculateInterference(partial1: Partial, partial2: Partial): number;

  process(chord: Tone[]): number {
    console.log(chord);
    return 0; // placeholder
  }
}