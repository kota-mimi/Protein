import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🎯 楽天API直接呼び出し開始')
    
    const rakutenApiUrl = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601'
    const params = new URLSearchParams({
      format: 'json',
      keyword: 'プロテイン',
      applicationId: '1054552037945576340',
      hits: '30',
      page: '1',
      sort: 'reviewCount'
    })
    
    console.log('🔍 楽天API呼び出し:', `${rakutenApiUrl}?${params}`)
    
    const response = await fetch(`${rakutenApiUrl}?${params}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    console.log('📡 レスポンス状況:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API失敗:', response.status, errorText)
      throw new Error(`楽天API失敗: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('✅ 楽天APIデータ取得:', data.Items?.length || 0, '件')
    
    if (!data.Items || data.Items.length === 0) {
      throw new Error('楽天APIで商品が見つかりません')
    }
    
    const products = data.Items.map((item: any) => {
      const product = item.Item
      return {
        id: `rakuten_${product.shopCode}_${product.itemCode}`,
        name: product.itemName,
        description: (product.itemCaption || product.itemName).substring(0, 200) + '...',
        image: product.mediumImageUrls?.[0]?.imageUrl || product.smallImageUrls?.[0]?.imageUrl || '/placeholder-protein.svg',
        category: 'WHEY',
        rating: product.reviewAverage || 0,
        reviews: product.reviewCount || 0,
        tags: ['楽天', 'プロテイン'],
        price: product.itemPrice || 0,
        protein: 20,
        calories: 110,
        servings: 30,
        shops: [{
          name: 'Rakuten' as const,
          price: product.itemPrice || 0,
          url: product.itemUrl || '#'
        }]
      }
    })
    
    console.log('🎉 成功:', products.length, '件の楽天商品を返します')
    
    return NextResponse.json({
      success: true,
      products: products,
      totalCount: products.length,
      lastUpdated: new Date().toISOString(),
      source: 'rakuten-api',
      message: `楽天API直接取得: ${products.length}件`
    })
    
  } catch (error: any) {
    console.error('❌ エラー:', error.message)
    
    // 楽天APIが失敗した場合のフォールバック
    const fallbackProducts = [
      {
        id: 'fb001',
        name: 'エクスプロージョン ホエイプロテイン ミルクチョコレート味 3kg',
        description: '大容量3kgでコスパ最強。筋力トレーニングに最適なプロテイン。',
        image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/x-plosion/cabinet/yec/11362306/241227_10000019.jpg?_ex=500x500',
        category: 'WHEY',
        rating: 4.5,
        reviews: 1988,
        tags: ['大容量', 'コスパ'],
        price: 8399,
        protein: 20.0,
        calories: 110,
        servings: 100,
        shops: [{ name: 'Rakuten' as const, price: 8399, url: 'https://item.rakuten.co.jp/x-plosion/10000019/' }]
      }
    ]
    
    return NextResponse.json({
      success: false,
      products: fallbackProducts,
      totalCount: fallbackProducts.length,
      lastUpdated: new Date().toISOString(),
      source: 'error-fallback',
      error: error.message,
      message: 'エラー時フォールバック'
    })
  }
}