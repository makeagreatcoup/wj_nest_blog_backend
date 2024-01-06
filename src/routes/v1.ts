import * as controllers from '@/modules/content/controllers';
import { Configure } from '@/modules/core/configure';
import { ApiVersionOption } from '@/modules/restful/type';
import * as userControllers from '@/modules/user/controllers';
// src/routes/v1.ts
export const v1 = async (configure: Configure): Promise<ApiVersionOption> => ({
  routes: [
    {
      name: 'app',
      path: '/',
      controllers: [],
      doc: {
        title: '应用接口',
        description: 'Blog的应用接口',
        tags: [
          { name: '网站', description: '网站相关查询' },
          { name: '分类', description: '分类的增删查改操作' },
          { name: '文章', description: '文章的增删查改操作' },
          { name: '评论', description: '评论的增删查操作' },
          { name: '标签', description: '标签的增删查操作' },
          { name: '评论人', description: '评论人的增删查操作' },
          { name: '账户操作', description: 'Auth操作' },
          { name: '用户管理', description: '用户的增删查改操作' },
        ],
      },
      children: [
        {
          name: 'content',
          path: 'content',
          controllers: Object.values(controllers),
        },
        {
          name: 'user',
          path: 'user',
          controllers: Object.values(userControllers),
        },
      ],
    },
  ],
});
