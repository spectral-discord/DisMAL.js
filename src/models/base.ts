'use strict';

import { ReducedTonePartial } from '../utils';
import { Preprocessor } from '../preprocessors/base';

/**
 * This is an abstract class that psychoacoustic
 * models should inherit from.
 */
export abstract class Model {
  readonly name;
  readonly description;
  readonly type;

  constructor() {
    this.name = 'Model';
    this.description = 'An abstract base class that psychoacoustic models can inherit from.';
    this.type = 'Abstract';
  }

  abstract process(
    partials: ReducedTonePartial[], 
    preprocessors?: Preprocessor[]
  ): Promise<number>;
}

/**
 * An abstract class that pure-dyad spectral
 * interference models can inherit from
 */
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

  abstract calculateInterference(
    partial1: ReducedTonePartial,
    partial2: ReducedTonePartial
  ): Promise<number>;

  async process(
    partials: ReducedTonePartial[],
    preprocessors?: Preprocessor[]
  ): Promise<number> {
    const partialInterferences: Promise<number>[] = [];

    if (preprocessors) {
      for (let j = 0; j < preprocessors?.length; ++j) {
        partials = preprocessors[j].process(partials);
      }
    }

    partials.forEach((partial, partialIndex) => {
      /**
       * Calculate the interference of the current partial
       * against all subsequent partials
       */
      partials.slice(partialIndex + 1).forEach(nextPartial => {
        partialInterferences.push(this.calculateInterference(partial, nextPartial));
      });
    });

    return Promise.all(partialInterferences)
      .then(interferences => interferences.reduce((acc, val) => acc + val, 0));
  }
}