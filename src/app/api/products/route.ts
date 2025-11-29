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
        // 本番環境用ダミーデータ（緊急対応）
        console.log('⚠️ キャッシュなし、ダミーデータを返します')
        const dummyData = {
          categories: [
            {
              name: "人気ランキング総合",
              category: "ranking_overall", 
              products: [
                {
                  id: "dummy_1",
                  name: "ザバス ホエイプロテイン100 ココア味",
                  brand: "ザバス",
                  imageUrl: "https://via.placeholder.com/150",
                  reviewAverage: 4.5,
                  reviewCount: 1000,
                  price: 3980,
                  pricePerServing: 133,
                  nutrition: { protein: 20, calories: 110 },
                  type: "ホエイ",
                  flavor: "チョコ",
                  shopName: "サンプル店舗",
                  affiliateUrl: "#"
                }
              ]
            }
          ]
        }
        return NextResponse.json({
          success: true,
          categories: dummyData.categories,
          source: 'dummy_fallback',
          note: 'Fallback dummy data - cache system needs initialization'
        })
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