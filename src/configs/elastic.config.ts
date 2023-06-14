import { createElasticConfig } from "@/modules/search/helper";

export const elastic = createElasticConfig((configure) => (
  {
    node: configure.env('ELASTIC_HOST', 'http://localhost:9200'),
    maxRetries: 10,
    requestTimeout: 60000,
    pingTimeout: 60000,
    sniffOnStart: true,
  }
))