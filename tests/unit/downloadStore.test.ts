import {
  DOWNLOAD_SCHEMA_VERSION,
  migrateDownloads,
  useDownloadStore,
} from '@/stores/downloadStore';
import { storage } from '@/stores/storage';
import { corruptPayloads } from '../fixtures/stores';

describe('downloadStore', () => {
  beforeEach(() => {
    storage.clearAll();
    useDownloadStore.setState({ downloads: {} });
  });

  it('starts with no downloads', () => {
    expect(useDownloadStore.getState().downloads).toEqual({});
  });

  it('sets a download entry for a guide', () => {
    useDownloadStore.getState().setDownload('test-guide', {
      status: 'downloading',
      localPath: null,
      bytes: 0,
    });

    expect(useDownloadStore.getState().downloads['test-guide']).toEqual({
      status: 'downloading',
      localPath: null,
      bytes: 0,
    });
  });

  it('overwrites an existing entry', () => {
    useDownloadStore.getState().setDownload('test-guide', {
      status: 'downloading',
      localPath: null,
      bytes: 0,
    });
    useDownloadStore.getState().setDownload('test-guide', {
      status: 'downloaded',
      localPath: '/local/test-guide.m4a',
      bytes: 1024,
    });

    expect(useDownloadStore.getState().downloads['test-guide']).toEqual({
      status: 'downloaded',
      localPath: '/local/test-guide.m4a',
      bytes: 1024,
    });
  });

  it('removes a download entry', () => {
    useDownloadStore.getState().setDownload('test-guide', {
      status: 'downloaded',
      localPath: '/local/test-guide.m4a',
      bytes: 1024,
    });
    useDownloadStore.getState().removeDownload('test-guide');

    expect(useDownloadStore.getState().downloads['test-guide']).toBeUndefined();
  });

  it('removing a nonexistent entry is a no-op', () => {
    useDownloadStore.getState().removeDownload('nonexistent-guide');
    expect(useDownloadStore.getState().downloads).toEqual({});
  });

  it('persists downloads to storage', () => {
    useDownloadStore.getState().setDownload('test-guide', {
      status: 'downloaded',
      localPath: '/local/test-guide.m4a',
      bytes: 1024,
    });

    const raw = storage.getString('downloads');
    expect(raw).toBeDefined();
    expect(JSON.parse(raw as string)).toMatchObject({
      version: DOWNLOAD_SCHEMA_VERSION,
      state: { downloads: { 'test-guide': { status: 'downloaded' } } },
    });
  });
});

describe('migrateDownloads', () => {
  it('carries a valid payload forward', () => {
    const downloads = {
      'test-guide': {
        status: 'downloaded' as const,
        localPath: '/local/test-guide.m4a',
        bytes: 1024,
      },
    };
    expect(migrateDownloads({ downloads }, DOWNLOAD_SCHEMA_VERSION)).toEqual({
      downloads,
    });
  });

  it.each(corruptPayloads)('tolerates a corrupt payload: %p', (payload) => {
    expect(migrateDownloads(payload, 0)).toEqual({ downloads: {} });
  });
});
