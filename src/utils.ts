'use strict';

import { TSON, Spectrum } from 'tsonify';

export interface Tone {
  spectrum: Spectrum,
  frequency: number,
  amplitudeMultiplier?: number,
}

export interface Partial {
  ratio: number,
  weight: number
}

export function validateAndReduceTones(tones: Tone[]) {
  return tones.map(tone => {
    const tson = new TSON({ spectra: [ tone.spectrum ] }, { reduce: true });

    if (tson.spectra) {
      return {
        spectrum: tson.spectra[0],
        frequency: tone.frequency,
        amplitudeMultiplier: tone.amplitudeMultiplier
      };
    } else {
      throw new Error('Reduced TSON is missing spectra. This is likely a bug.');
    }
  });
}