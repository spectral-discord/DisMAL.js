'use strict';

import { TSON, Spectrum, Partial, reduce } from 'tsonify';

export interface Tone {
  spectrum: Spectrum,
  frequency: number,
  amplitudeMultiplier?: number,
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

  async process(chord: Tone[]): Promise<number> {
    const partialInterferences: Promise<number>[] = [];

    const tones = chord.map(tone => {
      const reduced = reduce(new TSON({ spectra: [ tone.spectrum ] }));
      return {
        ...(reduced.spectra?[0] && { spectrum: reduced.spectra[0] } : undefined),
        frequency: tone.frequency,
        amplitudeMultiplier: tone.amplitudeMultiplier
      };
    });

    tones.forEach((tone, toneIndex) => {
      if (tone.spectrum) {
        const partials = tone.spectrum.partials;

        partials?.forEach((partial, partialIndex) => {
          if (partial.ratio && partial.weight) {
            /**
             * Calculate the interference of the partial
             * against the subsequent partials in the tone
             */
            for (
              let nextPartial = partialIndex + 1;
              nextPartial < partials.length;
              ++nextPartial
            ) {
              const nextRatio = partials[nextPartial].ratio;
              const nextWeight = partials[nextPartial].weight;

              if (nextRatio && nextWeight) {
                partialInterferences.push(this.calculateInterference(
                  {
                    ratio: partial.ratio * tone.frequency,
                    weight: partial.weight * (tone.amplitudeMultiplier || 1)
                  },
                  {
                    ratio: nextRatio * tone.frequency,
                    weight: nextWeight * (tone.amplitudeMultiplier || 1)
                  }
                ));
              }
            }

            /**
             * Calculate the interference of the partial 
             * against all subsequent tones' partials
             */
            for (
              let nextTone = toneIndex + 1;
              nextTone < tones.length;
              ++nextTone
            ) {
              const nextTonePartials = tones[nextTone].spectrum?.partials;
    
              if (nextTonePartials) {
                for (let nextPartial = 0; nextPartial < nextTonePartials.length; ++nextPartial) {
                  const nextRatio = nextTonePartials[nextPartial].ratio;
                  const nextWeight = nextTonePartials[nextPartial].weight;

                  if (nextRatio && nextWeight) {
                    partialInterferences.push(this.calculateInterference(
                      {
                        ratio: partial.ratio * tone.frequency,
                        weight: partial.weight * (tone.amplitudeMultiplier || 1)
                      },
                      {
                        ratio: nextRatio * tones[nextTone].frequency,
                        weight: nextWeight * (tones[nextTone].amplitudeMultiplier || 1)
                      }
                    ));
                  }
                }
              }
            }
          }
        });
      }
    });

    return Promise.all(partialInterferences)
      .then(interferences => interferences.reduce((acc, val) => acc + val, 0));
  }
}