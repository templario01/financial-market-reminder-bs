import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CacheManagerStore } from 'cache-manager';

@Injectable()
export class IOredisStore implements CacheManagerStore, OnModuleDestroy {
  constructor(private readonly redisClient: Redis) {}

  get name() {
    return IOredisStore.name;
  }

  onModuleDestroy() {
    this.disconnect();
  }

  get isCacheable() {
    return (value: any) => value !== null && value !== undefined;
  }

  async get(key: string): Promise<any> {
    return await this.redisClient.get(key);
  }

  async mget(...keys: string[]): Promise<unknown[]> {
    if (keys.length === 0) return [];
    return await this.redisClient.mget(keys);
  }

  async set(key: string, value: any, ttl?: number): Promise<any> {
    if (ttl) {
      return await this.redisClient.set(key, value, 'EX', ttl);
    }
    return await this.redisClient.set(key, value);
  }

  async mset(data: Record<string, any>, ttl?: number): Promise<void> {
    const entries = Object.entries(data);
    if (entries.length === 0) return;
    await this.redisClient.mset(data);
    if (ttl) {
      await Promise.all(
        Object.keys(data).map((key) => this.redisClient.expire(key, ttl)),
      );
    }
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async mdel(...keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    await this.redisClient.del(keys);
  }

  async ttl(key: string, ttl?: number): Promise<number> {
    if (ttl !== undefined) {
      await this.redisClient.expire(key, ttl);
    }
    return await this.redisClient.ttl(key);
  }

  async keys(): Promise<string[]> {
    return await this.redisClient.keys('*');
  }

  async reset?(): Promise<void> {
    const keys = await this.redisClient.keys('*');
    if (keys.length > 0) {
      await this.redisClient.del(keys);
    }
  }

  on?(event: string, listener: (...arguments_: any[]) => void): void {
    this.redisClient.on(event, listener);
  }

  async disconnect(): Promise<void> {
    await this.redisClient.quit();
  }
}
