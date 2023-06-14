import { resolve } from 'path';

import { Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { isNil } from 'lodash';
import {
  DataSource,
  DataSourceOptions,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  ObjectType,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { App } from '../core/app';
import { Configure } from '../core/configure';
import { CUSTOM_REPOSITORY_METADATA, EnvironmentType } from '../core/constants';
import { createConnectionOptions, deepMerge, panic } from '../core/helpers';
import { ConfigureFactory, ConfigureRegister } from '../core/type';

import {
  DbConfig,
  DbConfigOptions,
  DbFactoryBuilder,
  DefineFactory,
  FactoryOptions,
  IPaginateOptions,
  IPaginateResult,
  Seeder,
  SeederConstructor,
  SeederOptions,
  TypeormOption,
} from './types';
import { FactoryResolver } from './resolver';
import { Ora } from 'ora';

export const createDbOptions = (
  configure: Configure,
  options: DbConfigOptions,
) => {
  const newOptions: DbConfigOptions = {
    common: deepMerge(
      {
        charset: 'utf8mb4',
        logging: ['error'],
        migrations: [],
        paths: {
          migration: resolve(__dirname, '../../database/migrations'),
        },
      },
      options.common ?? {},
      'replace',
    ),
    connections: createConnectionOptions(options.connections ?? []),
  };
  newOptions.connections = newOptions.connections.map((connection) => {
    const entities = connection.entities ?? [];
    const newOption = { ...connection, entities };
    return deepMerge(
      newOptions.common,
      {
        ...newOption,
        synchronize: configure.getRunEnv() !== EnvironmentType.PRODUCTION,
        autoLoadEntities: true,
      } as any,
      'replace',
    );
  });
  return newOptions as DbConfig;
};

export const createDbConfig: (
  register: ConfigureRegister<RePartial<DbConfigOptions>>,
) => ConfigureFactory<DbConfigOptions, DbConfig> = (register) => ({
  register,
  hook: (configure, value) => createDbOptions(configure, value),
  defaultRegister: () => ({
    common: {
      charset: 'utf8mb4',
      logging: ['error'],
    },
    connections: [],
  }),
});

/**
 * 根据数据配置名称获取一个数据库连接配置
 * @param cname 默认为default
 */
export async function getDbConfig(cname = 'default') {
  const { connections = [] }: DbConfig = await App.configure.get<DbConfig>('database');
  const dbConfig = connections.find(({ name }) => name === cname);
  if (isNil(dbConfig)) panic(`Database connection named ${cname} not exists!`);
  return dbConfig as TypeormOption;
}

/**
 * 分页函数
 *
 */
export const paginate = async <T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  options: IPaginateOptions,
): Promise<IPaginateResult<T>> => {
  const start = options.page > 0 ? options.page - 1 : 0;
  const limit = options.limit > 0 ? options.limit : 0;
  const totalItems = await qb.getCount();
  qb.take(options.limit).skip(start * limit);
  const items = await qb.getMany();
  const totalPages =
    totalItems % limit === 0
      ? Math.floor(totalItems / limit)
      : Math.floor(totalItems / limit) + 1;
  const remainder = totalItems % limit !== 0 ? totalItems % limit : 0;
  const itemCount = options.page < totalPages ? limit : remainder;
  return {
    items,
    meta: {
      itemCount,
      totalItems,
      perPage: limit,
      totalPages,
      currentPage: options.page,
    },
  };
};
/**
 * 手动分页函数
 * @param options 分页条件
 * @param data 数据列表
 * @returns
 */
export function treePaginate<T extends ObjectLiteral>(
  options: IPaginateOptions,
  data: T[],
): IPaginateResult<T> {
  const { page, limit } = options;
  let items: T[] = [];
  const totalItems = data.length;
  const totalRst = totalItems / limit;
  const totalPages =
    totalRst > Math.floor(totalRst)
      ? Math.floor(totalRst) + 1
      : Math.floor(totalRst);

  let itemCount = 0;
  if (page <= totalPages) {
    itemCount =
      page === totalPages ? totalItems - (totalPages - 1) * limit : limit;
    const start = (page - 1) * limit;
    items = data.slice(start, start + itemCount);
  }
  return {
    meta: {
      itemCount,
      totalItems,
      perPage: limit,
      totalPages,
      currentPage: page,
    },
    items,
  };
}

/**
 * 获取自定义repository的实例
 * @param dataSource 数据库连接池
 * @param Repo repository类
 * @returns
 */
export const getCustomRepository = <
  T extends Repository<E>,
  E extends ObjectLiteral,
>(
  dataSource: DataSource,
  Repo: ClassType<T>,
): T => {
  if (isNil(Repo)) return null;
  const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_METADATA, Repo);
  if (!entity) return null;
  const base = dataSource.getRepository<ObjectType<any>>(entity);
  return new Repo(base.target, base.manager, base.queryRunner) as T;
};

/** ****************************** 类注册及读取 **************************** */

/**
 * 在模块上注册entity
 * @param configure 配置类实例
 * @param entities entity类列表
 * @param dataSource 数据连接名称,默认为default
 */
export const addEntities = async (
  configure: Configure,
  entities: EntityClassOrSchema[] = [],
  dataSource = 'default',
) => {
  const database = await configure.get<DbConfig>('database');
  if (isNil(database)) throw new Error(`Typeorm 配置找不到!`);
  const dbConfig = database.connections.find(({ name }) => name === dataSource);
  // eslint-disable-next-line prettier/prettier, prefer-template
  if (isNil(dbConfig))
    throw new Error(`连接的数据库 ${  dataSource  } 不存在!`);
  const oldEntities = (dbConfig.entities ?? []) as ObjectLiteral[];
  /**
   * 更新数据库配置,添加上新的模型
   */
  configure.set(
    'database.connections',
    database.connections.map((connection) =>
      connection.name === dataSource
        ? {
            ...connection,
            entities: [...entities, ...oldEntities],
          }
        : connection,
    ),
  );
  return TypeOrmModule.forFeature(entities, dataSource);
};

/**
 * 在模块上注册订阅者
 * @param configure 配置类实例
 * @param subscribers 订阅者列表
 * @param dataSource 数据库连接名称
 */
export const addSubscribers = async (
  configure: Configure,
  subscribers: Type<any>[] = [],
  dataSource = 'default',
) => {
  const database = await configure.get<DbConfig>('database');
  if (isNil(database)) throw new Error(`Typeorm 配置找不到!`);
  const dbConfig = database.connections.find(({ name }) => name === dataSource);
  if (isNil(dbConfig))
    throw new Error(`连接的数据库 ${  dataSource  } 不存在!`);

  const oldSubscribers = (dbConfig.subscribers ?? []) as any[];

  /**
   * 更新数据库配置,添加上新的订阅者
   */
  configure.set(
    'database.connections',
    database.connections.map((connection) =>
      connection.name === dataSource
        ? {
            ...connection,
            subscribers: [...oldSubscribers, ...subscribers],
          }
        : connection,
    ),
  );
  return subscribers;
};


/**
 * 获取Entity类名
 *
 * @export
 * @template T
 * @param {ObjectType<T>} entity
 * @returns {string}
 */
export function entityName<T>(entity: EntityTarget<T>): string {
  if (entity instanceof Function) return entity.name;
  if (!isNil(entity)) return new (entity as any)().constructor.name;
  throw new Error('Enity is not defined');
}

/**
* 忽略外键
* @param em EntityManager实例
* @param type 数据库类型
* @param disabled 是否禁用
*/
export async function resetForeignKey(
  em: EntityManager,
  type = 'mysql',
  disabled = true,
): Promise<EntityManager> {
  let key: string;
  let query: string;
  if (type === 'sqlite') {
      key = disabled ? 'OFF' : 'ON';
      query = `PRAGMA foreign_keys = ${key};`;
  } else {
      key = disabled ? '0' : '1';
      query = `SET FOREIGN_KEY_CHECKS = ${key};`;
  }
  await em.query(query);
  return em;
}

/**
* 允许填充类
* @param Clazz 填充类
* @param args 填充命令参数
* @param spinner Ora雪碧图标
*/
export async function runSeeder(
  Clazz: SeederConstructor,
  args: SeederOptions,
  spinner: Ora,
  configure: Configure,
): Promise<DataSource> {
  const seeder: Seeder = new Clazz(spinner, args);
  const dbConfig = await getDbConfig(args.connection);
  const dataSource = new DataSource({ ...dbConfig } as DataSourceOptions);
  await dataSource.initialize();
  const factoryMaps: FactoryOptions = {};
  for (const factory of dbConfig.factories) {
      const { entity, handler } = factory();
      factoryMaps[entity.name] = { entity, handler };
  }
  if (typeof args.transaction === 'boolean' && !args.transaction) {
      const em = await resetForeignKey(dataSource.manager, dataSource.options.type);
      await seeder.load({
          factorier: factoryBuilder(dataSource, factoryMaps),
          factories: factoryMaps,
          dataSource,
          em,
          configure,
          connection: args.connection ?? 'default',
      });
      await resetForeignKey(em, dataSource.options.type, false);
  } else {
      // 在事务中运行
      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
          const em = await resetForeignKey(queryRunner.manager, dataSource.options.type);
          await seeder.load({
              factorier: factoryBuilder(dataSource, factoryMaps),
              factories: factoryMaps,
              dataSource,
              em,
              configure,
              connection: args.connection ?? 'default',
          });
          await resetForeignKey(em, dataSource.options.type, false);
          // 提交事务
          await queryRunner.commitTransaction();
      } catch (err) {
          console.log(err);
          // 遇到错误则回滚
          await queryRunner.rollbackTransaction();
      } finally {
          // 执行事务
          await queryRunner.release();
      }
  }
  if (dataSource.isInitialized) await dataSource.destroy();
  return dataSource;
}

/**
* 定义factory用于生成数据
* @param entity 模型
* @param handler 处理器
*/
export const defineFactory: DefineFactory = (entity, handler) => () => ({
  entity,
  handler,
});

/**
* Factory构建器
* @param dataSource 数据连接池
* @param factories factory函数组
*/
export const factoryBuilder: DbFactoryBuilder =
  (dataSource, factories) => (entity) => (settings) => {
      const name = entityName(entity);
      if (!factories[name]) {
          throw new Error(`has none factory for entity named ${name}`);
      }
      return new FactoryResolver(
          name,
          entity,
          dataSource.createEntityManager(),
          factories[name].handler,
          settings,
      );
  };