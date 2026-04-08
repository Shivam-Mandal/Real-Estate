import { env } from "../config/env.js";

const memoryStore = new Map();
let redisClientPromise;
let redisUnavailableLogged = false;

const createRedisClient = async () => {
  if (env.cacheProvider !== "redis" || !env.redisUrl) {
    return null;
  }

  try {
    const { createClient } = await import("redis");
    const client = createClient({ url: env.redisUrl });
    client.on("error", () => {});
    await client.connect();
    return client;
  } catch {
    if (!redisUnavailableLogged) {
      redisUnavailableLogged = true;
      console.warn("Redis cache unavailable. Falling back to in-memory cache.");
    }
    return null;
  }
};

const getRedisClient = async () => {
  if (!redisClientPromise) {
    redisClientPromise = createRedisClient();
  }

  return redisClientPromise;
};

const getMemoryValue = (key) => {
  const entry = memoryStore.get(key);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    memoryStore.delete(key);
    return null;
  }

  return entry.value;
};

const setMemoryValue = (key, value, ttlSeconds) => {
  memoryStore.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

export const cacheService = {
  async get(key) {
    const redis = await getRedisClient();
    if (redis) {
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    }

    return getMemoryValue(key);
  },

  async set(key, value, ttlSeconds = env.cacheTtlSeconds) {
    const redis = await getRedisClient();
    if (redis) {
      await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
      return;
    }

    setMemoryValue(key, value, ttlSeconds);
  },

  async delByPrefix(prefix) {
    const redis = await getRedisClient();
    if (redis) {
      const keys = await redis.keys(`${prefix}*`);
      if (keys.length) {
        await redis.del(...keys);
      }
    }

    for (const key of memoryStore.keys()) {
      if (key.startsWith(prefix)) {
        memoryStore.delete(key);
      }
    }
  },

  async remember(key, ttlSeconds, computeValue) {
    const cached = await this.get(key);
    if (cached) {
      return cached;
    }

    const value = await computeValue();
    await this.set(key, value, ttlSeconds);
    return value;
  },
};
