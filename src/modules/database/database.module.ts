import { exit } from 'process';

import { DynamicModule, ModuleMetadata, Provider, Type } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  getDataSourceToken,
} from '@nestjs/typeorm';
import { DataSource, ObjectType } from 'typeorm';

import {
  CUSTOM_REPOSITORY_METADATA,
} from '../core/constants';
import { ModuleBuilder } from '../core/decorators/module-builder.decorator';
import { panic } from '../core/helpers';

import * as commands from './commands';
import { DataExistConstraint, UniqueConstraint, UniqueExistContraint, UniqueTreeConstraint, UniqueTreeExistConstraint } from './constraints';
import { DbConfig } from './types';

@ModuleBuilder(async configure=>{
  const imports:ModuleMetadata['imports']=[];
  if(!configure.has('database')){
    panic({message:'数据库配置错误'})
    exit(1)
  }
  const {connections} = configure.get<DbConfig>('database');
  console.log(connections)
  connections.forEach(option=>{
    imports.push(TypeOrmModule.forRoot(option as TypeOrmModuleOptions));
  })
  const providers:ModuleMetadata['providers']=[
    DataExistConstraint,
    UniqueConstraint,
    UniqueExistContraint,
    UniqueTreeConstraint,
    UniqueTreeExistConstraint,
  ]
  return {
    global:true,
    commands: Object.values(commands),
    imports,
    providers
  }
})
export class DatabaseModule {

  /**
   * 注册自定义repository
   * @param repositories 需要注册自定义类列表
   * @param dataSourceName 数据池名称
   * @returns 
   */
  static forRepository<T extends Type<any>>(
    repositories: T[],
    dataSourceName?: string,
  ): DynamicModule {
    const providers: Provider[] = [];
    repositories.forEach((Repo) => {
      const entity = Reflect.getMetadata(
        CUSTOM_REPOSITORY_METADATA,
        Repo,
      ) ;
      if (!entity) {
        return;
      }
      providers.push({
        inject: [getDataSourceToken(dataSourceName)],
        provide: Repo,
        useFactory: (dataSource: DataSource): InstanceType<typeof Repo> => {
          const base = dataSource.getRepository<ObjectType<any>>(entity);
          return new Repo(
            base.target,
            base.manager,
            base.queryRunner,
          );
        },
      });
    });
    return {
      exports: providers,
      module: DatabaseModule,
      providers,
    };
  }
}
