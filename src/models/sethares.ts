'use strict';

import { SpectralInterferenceModel } from './base';
import { ReducedTonePartial } from '../utils';

/**
 * A spectral interference model originally published
 * by William Sethares in 1998 and updated in 2005
 */
export default class SetharesModel extends SpectralInterferenceModel {
  readonly name;
  readonly description;
  readonly type;
  
  constructor() {
    super();

    this.name = 'Sethares (2005)';
    this.description = 'A spectral interference model originally published by William Sethares in 1998 and updated in 2005';
    this.type = 'Spectral Interference';
  }

  async calculateInterference(
    partial1: ReducedTonePartial,
    partial2: ReducedTonePartial
  ): Promise<number> {
    const curveInterp = 0.24 / (0.0207 * Math.min(partial1.frequency, partial2.frequency) + 18.96);
    const freqDiff = Math.abs(partial1.frequency - partial2.frequency);
    
    return Math.min(partial1.amplitude, partial2.amplitude)
      * (5 * Math.exp(-3.51 * curveInterp * freqDiff)
      + -5 * Math.exp(-5.75 * curveInterp * freqDiff));
  }
}