'use strict';

import { TSON, Spectrum, reduce } from 'tsonify';

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
    const tson = new TSON({ spectra: [ tone.spectrum ] });
    const reducedTson = reduce(tson);
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