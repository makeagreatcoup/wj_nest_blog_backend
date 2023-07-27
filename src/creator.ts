import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { createApp } from '@/modules/core/helpers/app';

import * as configs from './configs';

import { ContentModule } from './modules/content/content.module';
import { JwtAuthGuard } from './modules/user/guards';
import { UserModule } from './modules/user/user.module';

export const creator = createApp({
    configs,
    configure: { storage: true },
    modules: [UserModule, ContentModule],
    globals: { guard: JwtAuthGuard },
    builder: async ({ configure, BootModule }) => {
        return NestFactory.create<NestFastifyApplication>(BootModule, new FastifyAdapter(), {
            cors: {
                origin: ['http://localhost:3001'],
                credentials: true  ,
                //处理cors预检查
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
                allowedHeaders: ['Content-Type', 'Authorization'],
                maxAge: 3600
              },
            logger: ['error', 'warn'],
        });
    },
});
