'use strict';

import { TSON, Spectrum, reduce } from 'tsonify';

export interface Tone {
  spectrum: Spectrum,
  frequency: number,
  amplitudeMultiplier?: number,
}

export interface Partial {
  ratio: number,
  weight: number
}

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

  abstract calculateInterference(partial1: Partial, partial2: Partial): Promise<number>;

  async process(tones: Tone[]): Promise<number> {
    // Validate & reduce the spectra
    const reducedTones = tones.map(tone => {
      const tson = reduce(new TSON({ spectra: [ tone.spectrum ] }));
      return {
        ...(tson.spectra?[0] && { spectrum: tson.spectra[0] } : undefined),
        frequency: tone.frequency,
        amplitudeMultiplier: tone.amplitudeMultiplier
      };
    });

    const partialInterferences: Promise<number>[] = [];

    reducedTones.forEach((tone, toneIndex) => {
      tone.spectrum?.partials?.forEach((partial, partialIndex) => {
        /**
         * Calculate the interference of the current partial
         * against all subsequent partials in the tone
         */
        tone.spectrum?.partials?.slice(partialIndex + 1).forEach(nextPartial => {
          if (!partial.ratio || !partial.weight || !nextPartial.ratio || !nextPartial.weight) {
            return;
          }

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
          nextTone.spectrum?.partials?.forEach(nextPartial => {
            if (!partial.ratio || !partial.weight || !nextPartial.ratio || !nextPartial.weight) {
              return;
            }

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