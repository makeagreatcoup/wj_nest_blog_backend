import { Injectable } from '@nestjs/common';
import merge from 'deepmerge';

import sanitizeHtml = require('sanitize-html');
// import sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizeService {
  protected config: sanitizeHtml.IOptions = {};

  constructor() {
    this.config = {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'code']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        '*': ['class', 'style', 'height', 'width'],
      },
      parser: {
        lowerCaseTags: true,
      },
    };
  }

  sanitize(body: string, options?: sanitizeHtml.IOptions) {
    return sanitizeHtml(
      body,
      merge(this.config, options ?? {}, {
        arrayMerge: (_d, s, _o) => s,
      }),
    );
  }
}
