import { NextResponse } from 'next/server'

// フォールバック用の豊富な商品データ（本番環境で問題が発生した場合）
const fallbackProducts = [
  // ホエイプロテイン
  {
    id: 'fallback_whey_001',
    name: 'ザバス ホエイプロテイン100 リッチショコラ味 980g',
    description: 'ホエイプロテイン100%使用。水でもしっかりおいしく、7種のビタミンB群配合。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/kenkocom/cabinet/102/4902777302102.jpg?_ex=500x500',
    category: 'WHEY',
    rating: 4.6,
    reviews: 2500,
    tags: ['人気', 'チョコ'],
    price: 4815,
    protein: 19.5,
    calories: 110,
    servings: 33,
    shops: [{ name: 'Rakuten' as const, price: 4815, url: 'https://item.rakuten.co.jp/kenkocom/e535922h/' }]
  },
  {
    id: 'fallback_whey_002', 
    name: 'ビーレジェンド ホエイプロテイン 激うまチョコ風味 1kg',
    description: '圧倒的な美味しさとコスパを実現。国内製造で安心安全。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/belegend/cabinet/06151095/06151098/belegend-choko1kg.jpg?_ex=500x500',
    category: 'WHEY',
    rating: 4.7,
    reviews: 12000,
    tags: ['コスパ', '美味しい'],
    price: 3980,
    protein: 21.0,
    calories: 118,
    servings: 33,
    shops: [{ name: 'Rakuten' as const, price: 3980, url: 'https://item.rakuten.co.jp/belegend/belegend-choko1kg/' }]
  },
  {
    id: 'fallback_whey_003',
    name: 'VALX ホエイプロテイン チョコレート風味 1kg',
    description: '山本義徳監修。高品質ホエイプロテインで理想のボディメイクを。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/valx/cabinet/09243096/09243099/valx-choco1kg.jpg?_ex=500x500',
    category: 'WHEY',
    rating: 4.8,
    reviews: 3200,
    tags: ['山本義徳', '高品質'],
    price: 4980,
    protein: 21.8,
    calories: 120,
    servings: 33,
    shops: [{ name: 'Rakuten' as const, price: 4980, url: 'https://item.rakuten.co.jp/valx/valx-choco1kg/' }]
  },
  // ソイプロテイン
  {
    id: 'fallback_soy_001',
    name: 'ソイプロテイン 大豆プロテイン ココア味 1kg',
    description: '植物性プロテインで美容と健康をサポート。女性にも人気。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/nichiga/cabinet/protein/soy-cocoa1kg.jpg?_ex=500x500',
    category: 'VEGAN',
    rating: 4.3,
    reviews: 2100,
    tags: ['植物性', '美容'],
    price: 3280,
    protein: 18.5,
    calories: 105,
    servings: 33,
    shops: [{ name: 'Rakuten' as const, price: 3280, url: '#' }]
  }
]

// キャッシュされた商品データを返すAPI（楽天API直接取得版）
export async function GET() {
  try {
    console.log('📖 商品データ読み込み開始 - 楽天API直接取得モード')
    
    // 本番環境では直接楽天APIから取得（確実性重視）
    console.log('🎯 楽天APIから直接商品を取得します')
    
    // 複数のキーワードで商品を取得
    const keywords = ['プロテイン', 'ホエイプロテイン', 'ソイプロテイン']
    const allProducts: any[] = []
    
    for (const keyword of keywords) {
      try {
        // 直接楽天APIを呼び出し（内部API経由を避ける）
        const rakutenApiUrl = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601'
        const params = new URLSearchParams({
          format: 'json',
          keyword: keyword,
          applicationId: process.env.RAKUTEN_APPLICATION_ID || '1069064056043226144',
          hits: '30',
          page: '1',
          sort: 'reviewCount'
        })
        const rakutenUrl = `${rakutenApiUrl}?${params}`
        console.log(`🔍 取得中: ${keyword}`, rakutenUrl)
        
        const response = await fetch(rakutenUrl)
        if (response.ok) {
          const data = await response.json()
          if (data.Items?.length > 0) {
            console.log(`✅ ${keyword}: ${data.Items.length}件取得`)
            
            // 楽天APIの生データを統一形式に変換
            const convertedProducts = data.Items.map((item: any) => {
              const product = item.Item
              return {
                id: `rakuten_${product.shopCode}_${product.itemCode}`,
                name: product.itemName,
                description: product.itemCaption || product.itemName,
                image: product.mediumImageUrls?.[0]?.imageUrl || product.smallImageUrls?.[0]?.imageUrl || '/placeholder-protein.svg',
                category: keyword.includes('ソイ') ? 'VEGAN' : 'WHEY',
                rating: product.reviewAverage || 0,
                reviews: product.reviewCount || 0,
                tags: ['楽天', keyword],
                price: product.itemPrice || 0,
                protein: 20, // デフォルト値
                calories: 110, // デフォルト値
                servings: 30, // デフォルト値
                shops: [{
                  name: 'Rakuten' as const,
                  price: product.itemPrice || 0,
                  url: product.itemUrl || '#'
                }]
              }
            })
            
            allProducts.push(...convertedProducts)
          }
        }
      } catch (error) {
        console.error(`❌ ${keyword}の取得エラー:`, error)
      }
    }
    
    if (allProducts.length > 0) {
      console.log(`🎉 合計${allProducts.length}件の商品を楽天APIから取得成功`)
      return NextResponse.json({
        success: true,
        products: allProducts,
        totalCount: allProducts.length,
        lastUpdated: new Date().toISOString(),
        source: 'rakuten-api-direct',
        message: `楽天API直接取得: ${allProducts.length}件`
      })
    }
    
    // 楽天APIも失敗した場合はフォールバック
    console.log('⚠️ 楽天API取得失敗 - フォールバックデータ使用')
    return NextResponse.json({
      success: true,
      products: fallbackProducts,
      totalCount: fallbackProducts.length,
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
      message: 'APIエラー時フォールバックデータ使用'
    })
    
  } catch (error: any) {
    console.error('❌ 商品データ取得エラー:', error)
    return NextResponse.json({
      success: false,
      error: '商品データの取得に失敗しました',
      details: error.message
    }, { status: 500 })
  }
}