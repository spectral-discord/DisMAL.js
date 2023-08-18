'use strict';

import { SpectralInterferenceModel } from './base';
import { ReducedPartial } from 'tsonify';

/**
 * A spectral interference model published by
 * Pantelis Vassilakis in 2001, based on Sethares\' model
 */
export default class VassilakisModel extends SpectralInterferenceModel {
  readonly name;
  readonly description;
  readonly type;
  
  constructor() {
    super();

    this.name = 'Vassilakis (2001)';
    this.description = 'A spectral interference model published by Pantelis Vassilakis in 2001, based on Sethares\' model';
    this.type = 'Spectral Interference';
  }

  async calculateInterference(
    partial1: ReducedPartial,
    partial2: ReducedPartial
  ): Promise<number> {
    const curveInterp = 0.24 / (0.0207 * Math.min(partial1.ratio, partial2.ratio) + 18.96);
    const freqDiff = Math.abs(partial1.ratio - partial2.ratio);

    return Math.pow(partial1.weight * partial2.weight, 0.1)
      * (0.5 * Math.pow(2 * Math.min(partial1.weight, partial1.weight) / (partial1.weight + partial2.weight), 3.11))
      * ((5 * Math.exp(-3.51 * curveInterp * freqDiff)) + (-5 * Math.exp(-5.75 * curveInterp * freqDiff)));
  }
}