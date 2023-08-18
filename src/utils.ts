'use strict';

import { TSON, Spectrum, ReducedSpectrum, reduce } from 'tsonify';

export interface Tone {
  spectrum: Spectrum,
  frequency: number,
  amplitudeMultiplier?: number,
}

export interface ReducedTone {
  spectrum: ReducedSpectrum,
  frequency: number,
  amplitudeMultiplier?: number,
}

export function validateAndReduceTones(tones: Tone[]): ReducedTone[] {
  return tones.map(tone => {
    const tson = new TSON({ spectra: [ tone.spectrum ] });
    const reducedTson = reduce(tson);

    if (reducedTson.spectra?.[0]) {
      return {
        spectrum: reducedTson.spectra[0],
        frequency: tone.frequency,
        amplitudeMultiplier: tone.amplitudeMultiplier
      };
    } else {
      throw new Error('Reduced TSON is missing spectra. This is likely a bug.');
    }
  });
}