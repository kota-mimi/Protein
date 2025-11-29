import { NextResponse } from 'next/server'
import { loadFeaturedProductsCache, isCacheValid } from '@/lib/cache'

// 商品データ取得API（クライアントサイド用）
export async function GET() {
  try {
    // まずキャッシュから読み込み
    const cachedData = await loadFeaturedProductsCache()
    const isValid = await isCacheValid()
    
    if (cachedData && isValid) {
      return NextResponse.json({
        success: true,
        categories: cachedData.categories || [],
        source: 'cache',
        lastUpdated: cachedData.lastUpdated
      })
    } else {
      // キャッシュが古い場合、キャッシュデータがあれば古いデータでも返す
      console.log('⏰ キャッシュが古いですが、利用可能なデータを返します')
      
      if (cachedData && cachedData.categories) {
        return NextResponse.json({
          success: true,
          categories: cachedData.categories,
          source: 'expired_cache',
          lastUpdated: cachedData.lastUpdated,
          note: 'Using expired cache data. Fresh data will be available after next update.'
        })
      } else {
        throw new Error('No cached data available and unable to fetch fresh data')
      }
    }
  } catch (error: any) {
    console.error('❌ 商品データ取得エラー:', error)
    
    // エラー時はダミーデータまたは空データを返す
    return NextResponse.json({
      success: false,
      categories: [],
      error: error.message,
      source: 'error'
    }, { status: 500 })
  }
}