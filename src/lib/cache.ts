// Server-side only imports
const fs = typeof window === 'undefined' ? require('fs') : null
const path = typeof window === 'undefined' ? require('path') : null

const CACHE_KEY = 'featured-products'
const CACHE_TIMESTAMP_KEY = 'featured-products-timestamp'
const CACHE_DIR = typeof window === 'undefined' ? path.join(process.cwd(), 'cache') : ''
const CACHE_FILE = typeof window === 'undefined' ? path.join(CACHE_DIR, 'products.json') : ''

// 開発環境用ファイルベース・本番環境用Edge Configのハイブリッド対応
export async function saveFeaturedProductsCache(data: any) {
  try {
    // 本番環境では常にメモリキャッシュを使用（Edge Configは読み取り専用）
    global.memoryCache = data
    global.memoryCacheTimestamp = Date.now()
    console.log('✅ 人気商品キャッシュを保存しました (メモリ):', new Date().toLocaleString('ja-JP'))
    
    // 開発環境ではファイルベースも併用
    if (typeof window === 'undefined' && fs && path) {
      if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true })
      }
      const cacheData = {
        data: data,
        timestamp: Date.now()
      }
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2))
      console.log('✅ 開発環境ファイルキャッシュも保存:', new Date().toLocaleString('ja-JP'))
    }
  } catch (error) {
    console.error('❌ キャッシュ保存エラー:', error)
    // エラーでも最低限メモリに保存
    try {
      global.memoryCache = data
      global.memoryCacheTimestamp = Date.now()
      console.log('✅ エラー時メモリキャッシュに保存:', new Date().toLocaleString('ja-JP'))
    } catch (memError) {
      console.error('❌ メモリキャッシュ保存も失敗:', memError)
      throw error
    }
  }
}

// 商品データを読み込み（ハイブリッド対応）
export async function getFeaturedProductsCache() {
  return await loadFeaturedProductsCache()
}

// 商品データを読み込み（メモリキャッシュ優先）
export async function loadFeaturedProductsCache() {
  try {
    
    // メモリキャッシュを確認
    if (global.memoryCache) {
      console.log('✅ 人気商品キャッシュを読み込みました (メモリ):', new Date().toLocaleString('ja-JP'))
      return global.memoryCache
    }
    
    // 開発環境ではファイルベース
    if (typeof window === 'undefined' && fs && path && fs.existsSync(CACHE_FILE)) {
      const fileContent = fs.readFileSync(CACHE_FILE, 'utf8')
      const cacheData = JSON.parse(fileContent)
      console.log('✅ 人気商品キャッシュを読み込みました (開発環境・ファイル):', new Date().toLocaleString('ja-JP'))
      return cacheData.data
    }
    
    return null
  } catch (error) {
    console.log('⚠️ キャッシュが見つかりません。初回取得します。')
    // メモリキャッシュも確認
    if (global.memoryCache) {
      console.log('✅ エラー時メモリキャッシュから読み込み:', new Date().toLocaleString('ja-JP'))
      return global.memoryCache
    }
    return null
  }
}

// キャッシュの有効性をチェック（1週間以内かどうか・メモリ優先）
export async function isCacheValid() {
  try {
    let timestamp = null
    
    // メモリキャッシュのタイムスタンプを最初に確認
    if (global.memoryCacheTimestamp) {
      timestamp = global.memoryCacheTimestamp
    } else if (typeof window === 'undefined' && fs && path && fs.existsSync(CACHE_FILE)) {
      // 開発環境ではファイルベース
      const fileContent = fs.readFileSync(CACHE_FILE, 'utf8')
      const cacheData = JSON.parse(fileContent)
      timestamp = cacheData.timestamp
    }
    
    if (timestamp) {
      const cacheAge = Date.now() - Number(timestamp)
      const maxAge = 7 * 24 * 60 * 60 * 1000 // 1週間
      return cacheAge < maxAge
    }
    return false
  } catch {
    // エラーの場合、メモリキャッシュのタイムスタンプで最終確認
    if (global.memoryCacheTimestamp) {
      const cacheAge = Date.now() - Number(global.memoryCacheTimestamp)
      const maxAge = 7 * 24 * 60 * 60 * 1000 // 1週間
      return cacheAge < maxAge
    }
    return false
  }
}