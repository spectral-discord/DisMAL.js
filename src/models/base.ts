'use strict';

import { Tone, validateAndReduceTones } from '../utils';
import { ReducedPartial } from 'tsonify';

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

  abstract process(chord: Tone[]): Promise<number>;
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

  abstract calculateInterference(partial1: ReducedPartial, partial2: ReducedPartial): Promise<number>;

  async process(tones: Tone[]): Promise<number> {
    // Validate & reduce the spectra
    const reducedTones = validateAndReduceTones(tones);
    const partialInterferences: Promise<number>[] = [];

    reducedTones.forEach((tone, toneIndex) => {
      tone.spectrum.partials.forEach((partial, partialIndex) => {
        /**
         * Calculate the interference of the current partial
         * against all subsequent partials in the tone
         */
        tone.spectrum.partials.slice(partialIndex + 1).forEach(nextPartial => {
          partialInterferences.push(this.calculateInterference(
            {
              ratio: partial.ratio * tone.frequency,
              weight: partial.weight * (tone.amplitudeMultiplier || 1)
            },
            {
              ratio: nextPartial.ratio * tone.frequency,
              weight: nextPartial.weight * (tone.amplitudeMultiplier || 1)
            }
          ));
        });

        /**
         * Calculate the interference of the current partial 
         * against all partials of subsequent tones
         */
        reducedTones.slice(toneIndex + 1).forEach(nextTone => {
          nextTone.spectrum.partials.forEach(nextPartial => {
            partialInterferences.push(this.calculateInterference(
              {
                ratio: partial.ratio * tone.frequency,
                weight: partial.weight * (tone.amplitudeMultiplier || 1)
              },
              {
                ratio: nextPartial.ratio * nextTone.frequency,
                weight: nextPartial.weight * (nextTone.amplitudeMultiplier || 1)
              }
            ));
          });
        });
      });
    });

    return Promise.all(partialInterferences)
      .then(interferences => interferences.reduce((acc, val) => acc + val, 0));
  }
}