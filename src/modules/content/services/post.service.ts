import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { isFunction, isNil, omit } from 'lodash';
import {
  EntityNotFoundError,
  In,
  IsNull,
  Not,
  SelectQueryBuilder,
} from 'typeorm';

import { PostOrderType, SelectTrashMode } from '@/modules/core/constants';
import { toBoolean } from '@/modules/core/helpers';
import { BaseService } from '@/modules/database/base/service';
import { paginate, treePaginate } from '@/modules/database/helpers';
import { QueryHook } from '@/modules/database/types';
import { SearchType } from '@/modules/search/type';

import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dtos';
import { PostEntity } from '../entities/post.entity';
import { parseArrayParam } from '../helpers';
import { TagRepository,CategoryRepository,PostRepository } from '../repositories';

import { CategoryService } from './category.service';
import { SearchService } from './search.service';

// 文章查询接口
type FindParams = {
  [key in keyof Omit<QueryPostDto, 'limit' | 'page'>]: QueryPostDto[key];
};

@Injectable()
export class PostService extends BaseService<PostEntity,PostRepository,FindParams>{
  
  protected enableTrash = true;
  
  constructor(
    protected repository: PostRepository,
    protected categoryRepository: CategoryRepository,
    protected tagRepository: TagRepository,
    protected categoryService: CategoryService,
    protected searchService: SearchService,
    protected searchType: SearchType = 'against',
  ) {
    super(repository)
  }

  /**
   * 查询标题的数组
   */
  async titleList(){
    return this.repository.buildSingleQB()
      .select(["post.id as id", "title"])
      .getRawMany();
  }

  /**
   * 获取分页数据
   * @param options 分页选项
   * @param callback 额外查询条件
   */
  async paginate(options: QueryPostDto, callback?: QueryHook<PostEntity>) {
    if (
      !isNil(this.searchService) &&
      !isNil(options.search) &&
      this.searchType === 'elastic'
    ) {
      const { search: text, page, limit } = options;
      const results = await this.searchService.search(text);
      const ids = results.map((result) => result.id);
      const posts =
        ids.length <= 0
          ? []
          : await this.repository.find({ where: { id: In(ids) } });
      return treePaginate({ page, limit }, posts);
    }

    const qb = await this.buildListQuery(
      this.repository.buildBaseQB(),
      options,
      callback,
    );
    return paginate(qb, options);
  }

  /**
   * 根据id查询
   * @param id id
   * @param callback 额外查询条件
   * @returns 返回对象
   */
  async findById(id: string, callback?: QueryHook<PostEntity>) {
    let qb = this.repository.buildBaseQB();
    qb.where(`${this.repository.qbName}.id=:id`, { id });
    qb = !isNil(callback) && isFunction(callback) ? await callback(qb) : qb;
    const item = await qb.getOne();
    if (!item) {
      throw new EntityNotFoundError(PostEntity, 'entity not found');
    }
    return item;
  }

  /**
   * 保存数据
   * @param data 数据
   * @returns 返回当前对象
   */
  async create(data: CreatePostDto) {
    // const createDto = {
    //   ...data,
    //   category: data.category
    //     ? await this.categoryRepository.findBy({ id: In(data.category) })
    //     : [],
    // };
    const createDto = {
      ...data,
      tags: data.tags&&data.tags.length
        ? await this.tagRepository.findBy({ id: In(data.tags) })
        : [],
      category:await this.categoryRepository.findOneBy({id:data.category})
    }
    const item = await this.repository.save(createDto);
    if (!isNil(this.searchService)) {
      try {
        await this.searchService.create(item);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }
    return this.findById(item.id);
  }

  /**
   * 修改数据
   * @param data 数据
   * @returns 返回当前对象
   */
  async update(data: UpdatePostDto) {
    const post = await this.findById(data.id);
    // if (isArray(data.category)) {
    //   await this.categoryRepository
    //     .createQueryBuilder('post')
    //     .relation(PostEntity, 'category')
    //     .of(post)
    //     .addAndRemove(data.category, post.category ?? '');
    // }
    let tagsData 
    if (data.tags) {
      const tags=data.tags.length?await this.tagRepository.findBy({ id: In(data.tags) }):[]
      tagsData={tags}
    }
    
    const category=await this.categoryRepository.findOneBy({id:data.category})

    // await this.repository.update(data.id, omit({...data,category,tags}, ['id']));
    await this.repository.save({...data,...tagsData,category});
    if (!isNil(this.searchService)) {
      try {
        await this.searchService.update(post);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }
    return this.findById(data.id);
  }

  /**
   * 删除数据
   * @param id id
   * @returns 返回对象
   */
  async delete(ids: string[], trash?: boolean) {
    const result = await super.delete(ids,trash);
    if (!isNil(this.searchService)) {
      try {
        ids.forEach(async (id) => {
          await this.searchService.remove(id);
        });
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }
    
    return result;
  }

  /**
   * 恢复文章
   * @param ids
   * @returns
   */
  async restore(ids: string[]) {
    const result = await super.restore(ids);
    if (!isNil(this.searchService)) {
      try {
        ids.forEach(async (id) => {
          await this.searchService.remove(id);
        });
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }

    return result;
  }

  /**
   * 构建列表查询器
   * @param qb 初始查询构造器
   * @param options 查询选项
   * @param callback 额外查询条件
   * @returns 返回新qb对象
   */
  protected async buildListQuery(
    qb: SelectQueryBuilder<PostEntity>,
    options: FindParams,
    callback?: QueryHook<PostEntity>,
  ) {
    const {
      category,
      orderBy,
      isPublished,
      state,
      search,
      tags,
      startTime,
      endTime,
      trashed = SelectTrashMode.NONE,
    } = options;
    let newQb = qb;
    // 是否查询回收站
    newQb = newQb.where('1=1')
    if (trashed !== SelectTrashMode.NONE) {
      newQb.withDeleted();
      if (trashed === SelectTrashMode.ONLY) {
        newQb.andWhere('deleteAt is not null');
      }
    }
    if (typeof isPublished === 'boolean'||Boolean(isPublished)) {
      newQb = newQb.andWhere({
        publishedAt: isPublished&&toBoolean(isPublished) ? Not(IsNull()) : IsNull(),
      });
    }
    if (state) {
      newQb = newQb.andWhere({
        state
      });
    }
    if(tags&&tags.length>0){
      const tagsItems=await this.tagRepository.find({
        where: {
          id: In(parseArrayParam(tags))
        },
        relations: ['posts'],
        select: ['posts']
      });
      const postIds = tagsItems.reduce((acc, tagsItem) => {
        tagsItem.posts.map(post => {
          if (!acc.includes(post.id)) {
            acc.push(post.id); 
          }
          return post;
        });
        return acc;
      }, []);
      if(postIds&&postIds.length>0){
        newQb = newQb.andWhere('post.id IN (:...postIds)',{postIds})
      }else{
        newQb = newQb.andWhere('1=0')
      }
    }
    // mysql的两种查询
    if (!isNil(search)) {
      if (this.searchType === 'like') {
        qb.andWhere('title LIKE :search', { search: `%${search}%` })
          .orWhere('body LIKE :search', { search: `%${search}%` })
          .orWhere('summary LIKE :search', { search: `%${search}%` })
          .orWhere('category.name LIKE :search', { search: `%${search}%` });
      } else {
        qb.andWhere('MATCH(post.title) AGAINST (:search IN BOOLEAN MODE)', {
          search: `${search}*`,
        })
          .orWhere('MATCH(body) AGAINST (:search IN BOOLEAN MODE)', {
            search: `${search}*`,
          })
          .orWhere('MATCH(post.summary) AGAINST (:search IN BOOLEAN MODE)', {
            search: `${search}*`,
          })
          // .orWhere('MATCH(category.name) AGAINST (:search IN BOOLEAN MODE)', {
          //   search: `${search}*`,
          // });
      }
    }
    if (category) {
      newQb = qb.andWhere('categoryId =:category', { category })
    }
    if(startTime&&endTime){
      newQb = qb.andWhere('post.createdAt BETWEEN :startTime AND :endTime',{startTime,endTime})
    }
    newQb = this.queryOrderBy(newQb, orderBy);
    newQb = !isNil(callback) && isFunction(callback) ? await callback(newQb) : newQb;
    return newQb;
  }

  /**
   * 构建排序方式
   * @param qb 初始查询构造器
   * @param orderBy 排序方式
   * @returns 最终查询构造器
   */
  protected queryOrderBy(
    qb: SelectQueryBuilder<PostEntity>,
    orderBy?: PostOrderType,
  ) {
    switch (orderBy) {
      case PostOrderType.CREATED:
        return qb.orderBy('createdAt', 'DESC');
      case PostOrderType.UPDATED:
        return qb.orderBy('updatedAt', 'DESC');
      case PostOrderType.PUBLISHED:
        return qb.orderBy('post.publishedAt', 'DESC');
      case PostOrderType.COMMENTCOUNT:
        return qb.orderBy('commentCount', 'DESC');
      case PostOrderType.CUSTOM:
        return qb.orderBy('customOrder', 'DESC');
      default:
        return qb
    }
  }

  /**
   * 查询分类及其后代分类下的所有文章的query
   * @param id 
   * @param qb 
   * @returns 
   */
  protected async queryByCategory(
    id: string,
    qb: SelectQueryBuilder<PostEntity>,
  ) {
    const root = await this.categoryService.detail(id);
    const tree = await this.categoryRepository.findDescendantsTree(root);
    const flatDes = await this.categoryRepository.toFlatTrees(tree.children);
    const ids = [tree.id, ...flatDes.map((item) => item.id)];
    return qb.where('categoryId IN (:...ids)', { ids });
  }
}
