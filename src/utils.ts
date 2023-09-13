'use strict';

import { TSON, Spectrum } from 'tsonify';

export interface Tone {
  spectrum: Spectrum,
  frequency: number,
  amplitudeMultiplier?: number,
}

export interface ReducedTonePartial {
  spectrumId: string,
  frequency: number,
  amplitude: number,
}

export function reduceTones(tones: Tone[]): ReducedTonePartial[] {
  return tones.reduce((agg: ReducedTonePartial[], tone) => {
    const reducedTson = new TSON({ spectra: [ tone.spectrum ] }).getReduced();
    const spectrum = reducedTson.spectra?.[0];

    if (spectrum) {
      const partials = spectrum.partials.map(partial => ({
        frequency: partial.ratio * tone.frequency,
        amplitude: partial.weight * (tone.amplitudeMultiplier || 1),
        spectrumId: spectrum.id
      }));
      return agg.concat(partials);
    } else {
      throw new Error('Reduced TSON is missing spectra. This is likely a bug.');
    }
  }, []);
}