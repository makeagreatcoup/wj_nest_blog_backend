import { MigrationInterface, QueryRunner } from "typeorm";

export class FfHDJl1686581130264 implements MigrationInterface {
    name = 'FfHDJl1686581130264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`content_categories\` DROP FOREIGN KEY \`FK_a03aea27707893300382b6f18ae\``);
        await queryRunner.query(`ALTER TABLE \`content_posts_categories_content_categories\` DROP FOREIGN KEY \`FK_82926fe45def38f6a53838347a2\``);
        await queryRunner.query(`ALTER TABLE \`content_categories\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`content_categories\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`content_categories\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`content_comments\` DROP FOREIGN KEY \`FK_982a849f676860e5d6beb607f20\``);
        await queryRunner.query(`ALTER TABLE \`content_comments\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`content_comments\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`content_comments\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`content_comments\` DROP FOREIGN KEY \`FK_5e1c3747a0031f305e94493361f\``);
        await queryRunner.query(`ALTER TABLE \`content_posts_categories_content_categories\` DROP FOREIGN KEY \`FK_9172320639056856745c6bc21aa\``);
        await queryRunner.query(`ALTER TABLE \`content_posts\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`content_posts\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`content_posts\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`content_categories\` ADD CONSTRAINT \`FK_a03aea27707893300382b6f18ae\` FOREIGN KEY (\`parentId\`) REFERENCES \`content_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`content_comments\` ADD CONSTRAINT \`FK_5e1c3747a0031f305e94493361f\` FOREIGN KEY (\`postId\`) REFERENCES \`content_posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`content_comments\` ADD CONSTRAINT \`FK_982a849f676860e5d6beb607f20\` FOREIGN KEY (\`parentId\`) REFERENCES \`content_comments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`content_posts_categories_content_categories\` ADD CONSTRAINT \`FK_9172320639056856745c6bc21aa\` FOREIGN KEY (\`contentPostsId\`) REFERENCES \`content_posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`content_posts_categories_content_categories\` ADD CONSTRAINT \`FK_82926fe45def38f6a53838347a2\` FOREIGN KEY (\`contentCategoriesId\`) REFERENCES \`content_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`content_posts_categories_content_categories\` DROP FOREIGN KEY \`FK_82926fe45def38f6a53838347a2\``);
        await queryRunner.query(`ALTER TABLE \`content_posts_categories_content_categories\` DROP FOREIGN KEY \`FK_9172320639056856745c6bc21aa\``);
        await queryRunner.query(`ALTER TABLE \`content_comments\` DROP FOREIGN KEY \`FK_982a849f676860e5d6beb607f20\``);
        await queryRunner.query(`ALTER TABLE \`content_comments\` DROP FOREIGN KEY \`FK_5e1c3747a0031f305e94493361f\``);
        await queryRunner.query(`ALTER TABLE \`content_categories\` DROP FOREIGN KEY \`FK_a03aea27707893300382b6f18ae\``);
        await queryRunner.query(`ALTER TABLE \`content_posts\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`content_posts\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`content_posts\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`content_posts_categories_content_categories\` ADD CONSTRAINT \`FK_9172320639056856745c6bc21aa\` FOREIGN KEY (\`contentPostsId\`) REFERENCES \`content_posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`content_comments\` ADD CONSTRAINT \`FK_5e1c3747a0031f305e94493361f\` FOREIGN KEY (\`postId\`) REFERENCES \`content_posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`content_comments\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`content_comments\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`content_comments\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`content_comments\` ADD CONSTRAINT \`FK_982a849f676860e5d6beb607f20\` FOREIGN KEY (\`parentId\`) REFERENCES \`content_comments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`content_categories\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`content_categories\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`content_categories\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`content_posts_categories_content_categories\` ADD CONSTRAINT \`FK_82926fe45def38f6a53838347a2\` FOREIGN KEY (\`contentCategoriesId\`) REFERENCES \`content_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`content_categories\` ADD CONSTRAINT \`FK_a03aea27707893300382b6f18ae\` FOREIGN KEY (\`parentId\`) REFERENCES \`content_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
