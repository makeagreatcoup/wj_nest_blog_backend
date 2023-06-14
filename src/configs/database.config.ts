// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { toNumber } from 'lodash';

import { ContentFactory } from '@/database/factories/content.factory';
import { UserFactory } from '@/database/factories/user.factory';
import ContentSeeder from '@/database/seeders/content.seeder';
import UserSeeder from '@/database/seeders/user.seeder';
import { createDbConfig } from '@/modules/database/helpers';

// export const database = (): TypeOrmModuleOptions => ({
//   charset: 'utf8mb4',
//   logging: ['error'],
//   type: 'mysql',
//   host: '192.168.114.128',
//   port: 3306,
//   username: 'root',
//   password: 'wangj1995',
//   database: '3r_test',
//   synchronize: true,
//   autoLoadEntities: true,
//   cache: {
//     duration: 10000, // 缓存时间
//     type: 'database', // 缓存类型
//     options: {
//       // url:'',
//       useQueryCache: true, // 是否启用查询缓存
//       cacheQueries: true, // 是否缓存查询结果
//       invalidateQueryCache: true, // update、delete等操作自动更新缓存
//     },
//   },
// });
export const database = createDbConfig(configure=>({
  connections:[
    {
      type:'mysql',
      host:configure.env('DB_HOST','127.0.0.1'),
      port: configure.env('DB_PORT', (v) => toNumber(v), 3306),
      username: configure.env('DB_USER', 'root'),
      password: configure.env('DB_PASSWORD', ''),
      database: configure.env('DB_NAME', 'test'),
      seeders: [ContentSeeder,UserSeeder],
      factories: [ContentFactory,UserFactory]
    }
  ]
}))
