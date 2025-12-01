import { Product } from '@/types';
import fs from 'fs/promises';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'cache');
const CACHE_FILE = path.join(CACHE_DIR, 'products.json');
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1週間（ミリ秒）

interface CacheData {
  products: Product[];
  timestamp: number;
}

export async function getCachedProducts(): Promise<Product[] | null> {
  try {
    // キャッシュディレクトリが存在しない場合は作成
    await fs.mkdir(CACHE_DIR, { recursive: true });
    
    const cacheContent = await fs.readFile(CACHE_FILE, 'utf-8');
    const cacheData: CacheData = JSON.parse(cacheContent);
    
    const now = Date.now();
    const cacheAge = now - cacheData.timestamp;
    
    console.log(`📦 キャッシュ確認: ${Math.floor(cacheAge / (24 * 60 * 60 * 1000))}日前のデータ`);
    
    if (cacheAge < CACHE_DURATION) {
      console.log(`✅ キャッシュ使用: ${cacheData.products.length}件の商品`);
      return cacheData.products;
    } else {
      console.log('⏰ キャッシュ期限切れ');
      return null;
    }
  } catch (error) {
    console.log('📭 キャッシュファイル未存在');
    return null;
  }
}

export async function setCachedProducts(products: Product[]): Promise<void> {
  try {
    // キャッシュディレクトリが存在しない場合は作成
    await fs.mkdir(CACHE_DIR, { recursive: true });
    
    const cacheData: CacheData = {
      products,
      timestamp: Date.now()
    };
    
    await fs.writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2));
    console.log(`💾 キャッシュ保存: ${products.length}件の商品`);
  } catch (error) {
    console.error('❌ キャッシュ保存エラー:', error);
  }
}