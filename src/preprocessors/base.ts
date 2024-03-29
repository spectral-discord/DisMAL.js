'use strict';

import { ReducedTonePartial } from '../utils';

/**
 * This is an abstract class that all
 * preprocessors should inherit from.
 */
export abstract class Preprocessor {
  readonly name;
  readonly description;
  readonly type;

  constructor() {
    this.name = 'Model';
    this.description = 'An abstract base class that preprocessors can inherit from.';
    this.type = 'Abstract';
  }

  abstract process(partials: ReducedTonePartial[]): ReducedTonePartial[];
}
