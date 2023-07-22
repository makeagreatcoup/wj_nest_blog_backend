import * as fs from 'fs';

import * as path from 'path';

import { faker } from '@faker-js/faker';
import { existsSync } from 'fs-extra';
import { DataSource, EntityManager, In } from 'typeorm';

import { CategoryEntity, CommentEntity, PostEntity } from '@/modules/content/entities';
import { CategoryRepository } from '@/modules/content/repositories';

import { getRandListData, panic } from '@/modules/core/helpers';
import { BaseSeeder } from '@/modules/database/base';

import { DbFactory } from '@/modules/database/types';

import { getCustomRepository } from '../../modules/database/helpers';
import { category, CategoryData, PostData, posts } from '../factories/content.data';
import { IPostFactoryOptions } from '../factories/content.factory';

export default class ContentSeeder extends BaseSeeder {
    protected truncates = [PostEntity, CategoryEntity, CommentEntity];

    protected factorier!: DbFactory;

    async run(_factorier: DbFactory, _dataSource: DataSource, _em: EntityManager): Promise<any> {
        this.factorier = _factorier;
        await this.loadcategory(category);
        await this.loadPosts(posts);
    }

    private async genRandomComments(post: PostEntity, count: number, parent?: CommentEntity) {
        const comments: CommentEntity[] = [];
        for (let i = 0; i < count; i++) {
            const comment = new CommentEntity();
            comment.body = faker.lorem.paragraph(Math.floor(Math.random() * 18) + 1);
            comment.post = post;
            if (parent) {
                comment.parent = parent;
            }
            comments.push(await this.em.save(comment));
            if (Math.random() >= 0.8) {
                comment.children = await this.genRandomComments(
                    post,
                    Math.floor(Math.random() * 2),
                    comment,
                );
                await this.em.save(comment);
            }
        }
        return comments;
    }

    private async loadcategory(data: CategoryData[], parent?: CategoryEntity): Promise<void> {
        let order = 0;
        for (const item of data) {
            const category1 = new CategoryEntity();
            category1.name = item.name;
            category1.customOrder = order;
            if (parent) category1.parent = parent;
            await this.em.save(category);
            order++;
            if (item.children) {
                await this.loadcategory(item.children, category1);
            }
        }
    }

    private async loadPosts(data: PostData[]) {
        const allCates = await this.em.find(CategoryEntity);
        for (const item of data) {
            const filePath = path.join(__dirname, '../../assets/posts', item.contentFile);
            if (!existsSync(filePath)) {
                panic({
                    spinner: this.spinner,
                    message: `post content file ${filePath} not exits!`,
                });
            }
            const options: IPostFactoryOptions = {
                title: item.title,
                body: fs.readFileSync(filePath, 'utf8'),
                isPublished: true,
            };
            if (item.summary) {
                options.summary = item.summary;
            }
            if (item.category) {
                options.category = await getCustomRepository(
                    this.dataSource,
                    CategoryRepository,
                ).findOne({
                    where: { name : item.category},
                });
            }
            const post = await this.factorier(PostEntity)(options).create();

            await this.genRandomComments(post, Math.floor(Math.random() * 5));
        }
        const redoms = await this.factorier(PostEntity)<IPostFactoryOptions>(
        //     {
        //     category: allCates,
        // }
        ).createMany(100);
        for (const redom of redoms) {
            await this.genRandomComments(redom, Math.floor(Math.random() * 2));
        }
    }
}
