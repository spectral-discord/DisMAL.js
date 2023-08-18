'use strict';

import { ReducedTonePartial } from '../utils';
import { Preprocessor } from './base';

interface HearingRangeOptions {
  minFrequency: number,
  maxFrequency: number
}

/**
 * A preprocessor that removes partials that
 * fall outside of a provided hearing range.
 */
export default class HearingRange extends Preprocessor {
  readonly name;
  readonly description;
  readonly type;
  readonly options: HearingRangeOptions;

  constructor(options: HearingRangeOptions) {
    super();

    this.name = 'Hearing Range';
    this.description = 'Removes partials that fall outside of a provided hearing range.';
    this.type = 'Hearing Range';
    this.options = options;
  }

  process(partials: ReducedTonePartial[]): ReducedTonePartial[] {
    return partials.filter(partial => (
      partial.frequency >= (this.options.minFrequency || 20) &&
      partial.frequency <= (this.options.maxFrequency || 20000)
    ));
  }
}
