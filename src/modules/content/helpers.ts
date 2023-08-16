import { isArray } from 'lodash';

import { ConfigureFactory, ConfigureRegister } from '../core/type';
import { ContentConfig } from '../search/type';

export const createContentConfig: (
  register: ConfigureRegister<Partial<ContentConfig>>,
) => ConfigureFactory<Partial<ContentConfig>, ContentConfig> = (register) => ({
  register,
  defaultRegister: () => ({ searchType: 'against' }),
});

export function parseArrayParam(param: any): any[] {
  if (isArray(param)) {
    return param;
  }

  if (typeof param === 'string') {
    // 支持各种分隔符
    const separators = [',', ';', '|'];

    // 先尝试通用分隔符分解
    for (const sep of separators) {
      if (param.includes(sep)) {
        return param.split(sep);
      }
    }

    // 尝试 key[]=value 格式
    const matches = param.match(/([\w\.]+)\[\]=(.*)/g);
    if (matches) {
      return matches.map((item) => item.match(/=\((.*)\)/)[1]);
    }

    // 尝试 key=value&key=value 格式
    const isKeyValuePairs = /([\w\.]+)=([^&]+)/g.test(param);
    if (isKeyValuePairs) {
      const pairs = param.match(/([\w\.]+)=([^&]+)/g);
      return pairs.map((item) => item.match(/=(.*)/)[1]);
    }

    // 通用fallback,直接尝试拆分
    return param.split('&');
  }

  return [param];
}
