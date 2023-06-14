import { WriteResponseBase } from '@elastic/elasticsearch/lib/api/types';
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { instanceToPlain } from 'class-transformer';
import { pick } from 'lodash';

import { PostSearchBody } from '@/modules/search/type';

import { PostEntity } from "../entities";

export class SearchService{
  index='posts'

  constructor(protected esService:ElasticsearchService){}

  /**
   * 根据传入的字符串搜索文章
   * @param text 
   * @returns 
   */
  async search(text:string){
    const {hits}=await this.esService.search<PostEntity>({
      index:this.index,
      query:{
        multi_match:{query:text,fields:['title','body','summary','categories']}
      }
    })
    return hits.hits.map(item=>item._source);
  }

  /**
   * 创建文章时创建索引
   * @param post 
   * @returns 
   */
  async create(post:PostEntity):Promise<WriteResponseBase>{
    return this.esService.index<PostSearchBody>({
      index:this.index,
      document:{
        ...pick(instanceToPlain(post),['id','title','body','summary']),
        categories:(post.categories??[]).join(',')
      }
    })
  }

  /**
   * 更新文章时更新es字段
   * @param post 
   * @returns 
   */
  async update(post:PostEntity){
    const newBody:PostSearchBody={
      ...pick(instanceToPlain(post),['title','body','author','summary']),
      categories:(post.categories??[]).join(',')
    }
    const script=Object.entries(newBody).reduce((result,[key,value])=>`${result} ctx._source.${key}='${value}';`,'')
    return this.esService.updateByQuery({
      index:this.index,
      query:{match:{_id:post.id}},
      script
    })
  }

  /**
   * 删除文章时同时删除es数据
   * @param postId 
   * @returns 
   */
  async remove(postId:string){
    return this.esService.deleteByQuery({
      index:this.index,
      query:{match:{_id:postId}}
    })
  }
}