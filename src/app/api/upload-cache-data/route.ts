import { NextResponse } from 'next/server'
import { saveFeaturedProductsCache } from '@/lib/cache'

// ローカルから本番環境への直接キャッシュデータアップロード
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    // 簡易認証
    if (authHeader !== 'Bearer update-cache-from-local') {
      return NextResponse.json({
        success: false,
        error: '認証が必要です'
      }, { status: 401 })
    }
    
    console.log('📡 ローカルからキャッシュデータ受信開始...')
    
    const cacheData = await request.json()
    
    if (!cacheData || !cacheData.categories) {
      return NextResponse.json({
        success: false,
        error: '無効なキャッシュデータです'
      }, { status: 400 })
    }
    
    // 受信データをそのまま保存
    await saveFeaturedProductsCache(cacheData)
    
    const productCount = cacheData.categories.reduce((total: number, cat: any) => 
      total + (cat.products ? cat.products.length : 0), 0
    )
    
    console.log(`✅ ローカルキャッシュデータ保存完了: ${cacheData.categories.length}カテゴリ, ${productCount}商品`)
    
    return NextResponse.json({
      success: true,
      message: `ローカルキャッシュデータ受信完了: ${cacheData.categories.length}カテゴリ, ${productCount}商品`,
      categories: cacheData.categories.length,
      products: productCount,
      timestamp: new Date().toLocaleString('ja-JP')
    })
    
  } catch (error: any) {
    console.error('❌ キャッシュデータアップロードエラー:', error)
    return NextResponse.json({
      success: false,
      error: 'キャッシュデータの保存に失敗しました',
      details: error.message
    }, { status: 500 })
  }
}