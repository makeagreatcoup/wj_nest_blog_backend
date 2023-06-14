import { Configure } from "@/modules/core/configure";

import { ApiConfig } from "@/modules/restful/type";

import { v1 } from "./v1";

export const api = async (configure: Configure): Promise<ApiConfig> => ({
  title: configure.env('API_TITLE', 'WuJi博客项目'),
  description: configure.env('API_DESCRIPTION', 'WuJi博客项目'),
  auth: true,
  prefix: { route: 'api', doc: 'api-docs' },
  default: configure.env('API_DEFAULT_VERSION', 'v1'),
  enabled: [],
  versions: { v1: await v1(configure) },
});
