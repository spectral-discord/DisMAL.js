'use strict';

import { Tone, validateAndReduceTones } from '../utils';
import { Preprocessor } from './base';

interface HearingRangeOptions {
  minFrequency: number,
  maxFrequency: number
}

/**
 * A preprocessor that removes partials that
 * fall outside of a provided hearing range.
 */
export abstract class HearingRange extends Preprocessor {
  readonly name;
  readonly description;
  readonly type;

  constructor() {
    super();

    this.name = 'Hearing Range';
    this.description = 'Removes partials that fall outside of a provided hearing range.';
    this.type = 'Hearing Range';
  }

  async process(chord: Tone[], options: HearingRangeOptions): Promise<Tone[]> {
    const reducedTones = validateAndReduceTones(chord);

    reducedTones.forEach(tone => {
      const rootFreq = tone.frequency;
      tone.spectrum.partials = tone.spectrum.partials.filter(partial => {
        return partial.ratio * rootFreq >= (options.minFrequency || 20) 
          && partial.ratio * rootFreq <= (options.maxFrequency || 20000);
      });
    });

    return reducedTones;
  }
}
