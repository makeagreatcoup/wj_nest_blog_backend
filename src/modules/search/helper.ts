import { ElasticsearchModuleOptions } from "@nestjs/elasticsearch";

import { ConfigureFactory, ConfigureRegister } from "../core/type";

type E = ElasticsearchModuleOptions;
export const createElasticConfig: (
    register: ConfigureRegister<Partial<E>>,
) => ConfigureFactory<Partial<E>, E> = (register) => ({
    register,
    defaultRegister: ()=>({})
});