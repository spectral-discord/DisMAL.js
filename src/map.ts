'use strict';

import { Model } from './models/base';
import { Preprocessor } from './preprocessors/base';
import { reduceTones, Tone } from './utils';
import * as Joi from 'joi';

interface MapOptions {
  startFrequency: number,
  endRatio: number,
  numSteps: number,
  varId: string,
  logarithmicSteps?: boolean,
  preprocessors?: Preprocessor[]
}

const MapOptionsValidation = Joi.object().keys({
  startFrequency: Joi.number().min(0).required(),
  endRatio: Joi.number().min(1).required(),
  numSteps: Joi.number().integer().min(0).required(),
  varId: Joi.string().required(),
  logarithmicSteps: Joi.boolean().optional(),
  preprocessors: Joi.array().items(Joi.object().keys({
    process: Joi.function().required()
  })).optional()
});

export default async function processMap(
  model: Model,
  tones: Tone[],
  mapOptions: MapOptions
): Promise<number[]> {
  Joi.assert(mapOptions, MapOptionsValidation);

  const {
    startFrequency,
    endRatio,
    numSteps,
    varId,
    logarithmicSteps,
    preprocessors
  } = mapOptions;

  const varIndex = tones.findIndex(tone => tone.spectrum.id === varId);

  if (varIndex === -1) {
    throw new Error('`tones` array does not contain a spectrum with an ID that matches `mapOptions.varId`');
  }

  const stepSize = logarithmicSteps
    ? Math.pow(endRatio, 1.0 / (numSteps - 1))
    : (endRatio * startFrequency - startFrequency) / (numSteps - 1);

  const promises: Promise<number>[] = [];
  const partials = reduceTones(tones);

  for (let i = 0; i < numSteps; ++i) {
    tones[varIndex].frequency = logarithmicSteps
      ? startFrequency * Math.pow(stepSize, i)
      : startFrequency + stepSize * i;

    let stepPartials = partials;

    if (preprocessors) {
      for (let j = 0; j < preprocessors?.length; ++j) {
        stepPartials = preprocessors[j].process(stepPartials);
      }
    }
        
    promises.push(model.process(stepPartials, preprocessors));
  }

  return Promise.all(promises);
}
