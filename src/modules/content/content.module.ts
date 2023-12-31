import { ModuleMetadata } from '@nestjs/common';

import { ModuleBuilder } from '../core/decorators/module-builder.decorator';
import { DatabaseModule } from '../database/database.module';
import { addEntities } from '../database/helpers';

import * as entities from './entities';
import * as repositories from './repositories';
import { CategoryRepository, PostRepository, TagRepository } from './repositories';
import * as services from './services';
import { CategoryService } from './services';
import { PostService } from './services/post.service';
import { SearchService } from './services/search.service';
import {SearchType } from './types';

@ModuleBuilder(async configure=>{
  const searchType = configure.get<SearchType>('content.searchType','against');
  const providers:ModuleMetadata['providers']=[
    ...Object.values(services),
    // ...await addSubscribers(configure,[PostSubscriber]),
    {
      provide:PostService,
      inject:[
        PostRepository,
        CategoryRepository,
        TagRepository,
        CategoryService,
        {token:SearchService,optional:true}
      ],
      useFactory(
        postRepository:PostRepository,
        categoryRepository:CategoryRepository,
        tagRepository:TagRepository,
        categoryService:CategoryService,
        searchService?:SearchService
      ){
        return new PostService(
          postRepository,categoryRepository,tagRepository,categoryService,searchService,searchType
        )
      }
    }
  ]
  if(configure.has('elastic')&&searchType==='elastic'){
    providers.push(SearchService)
  }
  return {
    imports:[
      await addEntities(configure,Object.values(entities)),
      // TypeOrmModule.forFeature(Object.values(entities)),
      DatabaseModule.forRepository(Object.values(repositories))
    ],
    // controllers:Object.values(controllers),
    providers,
    exports:[
      ...Object.values(services),
      PostService,
      DatabaseModule.forRepository(Object.values(repositories))
    ]
  }
})
export class ContentModule{}