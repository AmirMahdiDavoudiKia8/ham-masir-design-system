import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

// ISR/page cache in KV (NEXT_INC_CACHE_KV), revalidation tags strongly
// consistent in D1 (revalidations table), on-demand revalidation queued
// through a Durable Object so revalidatePath/revalidateTag from server
// actions actually invalidate the KV cache. enableCacheInterception serves
// the cached copy from middleware on cache hits — the CPU-saving path that
// keeps dynamic SSR off most requests.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: d1NextTagCache,
  queue: doQueue,
  enableCacheInterception: true,
});
