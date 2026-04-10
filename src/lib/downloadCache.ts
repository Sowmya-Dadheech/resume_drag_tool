export interface DownloadItem {
  data: Buffer | string | ArrayBuffer;
  contentType: string;
  filename: string;
}

// Global cache to temporarily store files for download (bypasses Safari PWA blob bug)
// This will persist in memory during the dev server execution
const globalForCache = global as unknown as { downloadCache: Map<string, DownloadItem> };

export const downloadCache = globalForCache.downloadCache || new Map<string, DownloadItem>();

if (process.env.NODE_ENV !== 'production') {
  globalForCache.downloadCache = downloadCache;
}
