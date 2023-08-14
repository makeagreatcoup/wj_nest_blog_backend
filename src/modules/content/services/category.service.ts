
import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { EntityNotFoundError } from 'typeorm';

import { SelectTrashMode } from '@/modules/core/constants';
import { BaseService } from '@/modules/database/base/service';

import {
  CreateCategoryDto,
  QueryCategoryTreeDto,
  UpdateCategoryDto,
} from '../dtos/category.dto';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryRepository } from '../repositories/category.repository';


@Injectable()
export class CategoryService extends BaseService<CategoryEntity,CategoryRepository>{

  protected enableTrash = true;

  constructor(protected repository:CategoryRepository){
    super(repository)
  }

  /**
   * 查询分类树
   * @returns
   */
  async findTrees(options:QueryCategoryTreeDto) {
    const {trashed=SelectTrashMode.NONE}=options;
    
    return this.repository.findTrees({
      withTrashed:trashed===SelectTrashMode.ALL||trashed===SelectTrashMode.ONLY,
      onlyTrashed:trashed===SelectTrashMode.ONLY
    });
  }

  /**
   * 新增
   * @param data
   * @returns
   */
  async create(data: CreateCategoryDto) {
    const item = await this.repository.save({
      ...data,
      parent: await this.getParent(undefined, data.parent),
    });
    return this.detail(item.id);
  }

  /**
   * 修改对象
   * @param data
   * @returns
   */
  async update(data: UpdateCategoryDto) {
    const parent = await this.getParent(data.id, data.parent);
    const querySet = omit({...data,parent}, ['id','depth','parent']);
    if (Object.keys(querySet).length > 0) {
      await this.repository.update(data.id, querySet);
    }
    const detail = await this.detail(data.id);
    const updateParent =
      (!detail.parent && parent) ||
      (detail.parent && (!parent || detail.parent.id !== parent.id));

    if (updateParent) {
      detail.parent = parent;
      await this.repository.save(detail);
    }
    return detail;
  }

  /**
   * 获取父类分类
   * @param currentId 当前分类id
   * @param parentId 父类分类id
   * @returns
   */
  protected async getParent(currentId?: string, parentId?: string) {
    if (currentId === parentId) {
      return undefined;
    }
    let parent: CategoryEntity | undefined;
    if (parentId !== undefined) {
      if (parentId === null) return null;
      parent = await this.repository.findOneByOrFail({ id: parentId });
      if (!parent) {
        throw new EntityNotFoundError(
          CategoryEntity,
          `父类分类${parentId}不存在`,
        );
      }
    }
    return parent;
  }
}
