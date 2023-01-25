'use strict';

import { Model, Tone } from './models/base';
import * as Joi from 'joi';

interface MapOptions {
  startFrequency: number,
  endRatio: number,
  numSteps: number,
  varId: string,
  logarithmicSteps?: boolean
}

const MapOptionsValidation = Joi.object().keys({
  startFrequency: Joi.number().min(0).required(),
  endRatio: Joi.number().min(1).required(),
  numSteps: Joi.number().integer().min(0).required(),
  varId: Joi.string().required(),
  logarithmicSteps: Joi.boolean().optional()
});

export default async function processMap(
  model: Model,
  tones: Tone[],
  mapOptions: MapOptions
): Promise<number[]> {
  await Joi.assert(mapOptions, MapOptionsValidation);

  const {
    startFrequency,
    endRatio,
    numSteps,
    varId,
    logarithmicSteps
  } = mapOptions;

  const varIndex = tones.findIndex(tone => tone.spectrum.id === varId);

  if (varIndex === -1) {
    throw new Error('`tones` array does not contain a spectrum with an ID that matches `mapOptions.varId`');
  }

  const stepSize = logarithmicSteps
    ? Math.pow(endRatio, 1.0 / (numSteps - 1))
    : (endRatio * startFrequency - startFrequency) / (numSteps - 1);

  const promises: Promise<number>[] = [];

  for (let i = 0; i < numSteps; ++i) {
    tones[varIndex].frequency = logarithmicSteps
      ? startFrequency * Math.pow(stepSize, i)
      : startFrequency + stepSize * i;
    
    // TODO: Add preprocessors here
    
    promises.push(model.process(tones));
  }

  return Promise.all(promises);
}