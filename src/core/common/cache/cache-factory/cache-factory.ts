import { CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable, Logger } from '@nestjs/common';
import { KeyvAdapter } from 'cache-manager';
import { Redis } from 'ioredis';
import { IOredisStore } from '../stores/ioredis.store';
import { fromEvent, throttleTime } from 'rxjs';

@Injectable()
export class CacheFactory implements CacheOptionsFactory {
  private readonly logger = new Logger(CacheFactory.name);
  createCacheOptions() {
    const redis = new Redis(
      'rediss://default:AVPuAAIncDE3MDU5ZThmZWQ0YTQ0NDZkYjFhOTRmYzczYjM4N2YyOXAxMjE0ODY@stable-gobbler-21486.upstash.io:6379',
    );

    fromEvent(redis, 'error')
      .pipe(throttleTime(60000))
      .subscribe((error) => {
        this.logger.error('Redis connection error:', error);
      });

    return {
      ttl: 86400,
      stores: [new KeyvAdapter(new IOredisStore(redis))],
    };
  }
}
