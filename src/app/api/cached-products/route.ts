import { NextResponse } from 'next/server'

// 静的商品データ（150商品）
const staticProducts = [
  // ホエイプロテイン
  {
    id: 'whey_001',
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
    id: 'whey_002', 
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
    id: 'whey_003',
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
  {
    id: 'whey_004',
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
  },
  {
    id: 'whey_005',
    name: 'DNS プロテインホエイ100 チョコレート風味 1kg',
    description: 'アスリート向け高品質プロテイン。純度の高いホエイプロテインを使用。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/kenkocom/cabinet/102/4902777302102.jpg?_ex=500x500',
    category: 'WHEY',
    rating: 4.4,
    reviews: 890,
    tags: ['アスリート', '高純度'],
    price: 5400,
    protein: 22.0,
    calories: 115,
    servings: 30,
    shops: [{ name: 'Rakuten' as const, price: 5400, url: '#' }]
  },
  {
    id: 'whey_006',
    name: 'ウィダー マッスルフィットプロテイン バニラ味 900g',
    description: 'EMR（酵素分解ルチン）配合で効率的な筋肉作りをサポート。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/kenkocom/cabinet/102/4902777302102.jpg?_ex=500x500',
    category: 'WHEY',
    rating: 4.3,
    reviews: 1200,
    tags: ['EMR配合', 'バニラ'],
    price: 4200,
    protein: 20.0,
    calories: 108,
    servings: 28,
    shops: [{ name: 'Rakuten' as const, price: 4200, url: '#' }]
  },
  {
    id: 'whey_007',
    name: 'ゴールドスタンダード 100%ホエイ ダブルリッチチョコレート',
    description: '世界No.1ブランド。最高品質のホエイプロテインアイソレート使用。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/kenkocom/cabinet/102/4902777302102.jpg?_ex=500x500',
    category: 'WHEY',
    rating: 4.9,
    reviews: 5600,
    tags: ['世界No1', '最高品質'],
    price: 6800,
    protein: 24.0,
    calories: 120,
    servings: 29,
    shops: [{ name: 'Rakuten' as const, price: 6800, url: '#' }]
  },
  {
    id: 'whey_008',
    name: 'アルプロン ホエイプロテイン チョコチップミルクココア風味',
    description: '国内製造で安心安全。チョコチップ入りで美味しさ抜群。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/kenkocom/cabinet/102/4902777302102.jpg?_ex=500x500',
    category: 'WHEY',
    rating: 4.2,
    reviews: 2100,
    tags: ['国内製造', 'チョコチップ'],
    price: 3200,
    protein: 19.0,
    calories: 112,
    servings: 35,
    shops: [{ name: 'Rakuten' as const, price: 3200, url: '#' }]
  },
  // ソイプロテイン
  {
    id: 'soy_001',
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
  },
  {
    id: 'soy_002',
    name: 'ウェルネス ソイプロテイン 抹茶味 1kg',
    description: '上質な大豆プロテインを使用。抹茶の風味で飲みやすい。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/nichiga/cabinet/protein/soy-cocoa1kg.jpg?_ex=500x500',
    category: 'VEGAN',
    rating: 4.4,
    reviews: 1800,
    tags: ['抹茶', 'ウェルネス'],
    price: 3680,
    protein: 19.0,
    calories: 108,
    servings: 32,
    shops: [{ name: 'Rakuten' as const, price: 3680, url: '#' }]
  }
]

// 追加で140個の商品を生成
const generateAdditionalProducts = () => {
  const additionalProducts = []
  
  // ベース商品データ
  const baseProducts = [
    { name: 'ザバス ホエイプロテイン', category: 'WHEY', basePrice: 4000 },
    { name: 'ビーレジェンド プロテイン', category: 'WHEY', basePrice: 3500 },
    { name: 'VALX プロテイン', category: 'WHEY', basePrice: 4500 },
    { name: 'DNS プロテイン', category: 'WHEY', basePrice: 5000 },
    { name: 'ソイプロテイン', category: 'VEGAN', basePrice: 3000 },
    { name: 'カゼインプロテイン', category: 'WHEY', basePrice: 4800 }
  ]
  
  const flavors = ['チョコ味', 'バニラ味', 'ストロベリー味', 'バナナ味', '抹茶味', 'ミルクティー味', 'ココア味']
  const sizes = ['500g', '1kg', '2kg', '3kg']
  
  for (let i = 0; i < 140; i++) {
    const base = baseProducts[i % baseProducts.length]
    const flavor = flavors[i % flavors.length]
    const size = sizes[i % sizes.length]
    
    additionalProducts.push({
      id: `product_${(i + 11).toString().padStart(3, '0')}`,
      name: `${base.name} ${flavor} ${size}`,
      description: `高品質なプロテインで理想のボディメイクを実現。${flavor}で美味しく続けられます。`,
      image: base.category === 'VEGAN' 
        ? 'https://thumbnail.image.rakuten.co.jp/@0_mall/nichiga/cabinet/protein/soy-cocoa1kg.jpg?_ex=500x500'
        : 'https://thumbnail.image.rakuten.co.jp/@0_mall/kenkocom/cabinet/102/4902777302102.jpg?_ex=500x500',
      category: base.category,
      rating: Math.round((3.8 + Math.random() * 1.2) * 10) / 10,
      reviews: Math.floor(200 + Math.random() * 8000),
      tags: [flavor.replace('味', ''), size],
      price: Math.floor(base.basePrice + Math.random() * 2000),
      protein: Math.round((17 + Math.random() * 6) * 10) / 10,
      calories: Math.floor(95 + Math.random() * 35),
      servings: Math.floor(25 + Math.random() * 20),
      shops: [{ 
        name: 'Rakuten' as const, 
        price: Math.floor(base.basePrice + Math.random() * 2000), 
        url: '#' 
      }]
    })
  }
  
  return additionalProducts
}

const allProducts = [...staticProducts, ...generateAdditionalProducts()]

export async function GET() {
  try {
    console.log('📖 商品データ読み込み開始')
    
    // 楽天APIから実際のデータを取得
    const keywords = ['プロテイン', 'ホエイプロテイン', 'ソイプロテイン']
    const rakutenProducts: any[] = []
    
    for (const keyword of keywords) {
      try {
        // 楽天APIを直接呼び出し（環境変数なしで動作）
        const rakutenApiUrl = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601'
        const params = new URLSearchParams({
          format: 'json',
          keyword: keyword,
          applicationId: '1054552037945576340', // 正しいID
          hits: '30',
          page: '1',
          sort: 'reviewCount'
        })
        
        console.log(`🔍 取得中: ${keyword}`, `${rakutenApiUrl}?${params}`)
        
        const response = await fetch(`${rakutenApiUrl}?${params}`)
        console.log(`📡 ${keyword} レスポンス:`, response.status, response.statusText)
        
        if (response.ok) {
          const data = await response.json()
          if (data.Items?.length > 0) {
            console.log(`✅ ${keyword}: ${data.Items.length}件取得`)
            
            // 楽天APIの生データを統一形式に変換
            const convertedProducts = data.Items.slice(0, 20).map((item: any) => {
              const product = item.Item
              
              // 画像URLを適切に取得
              let imageUrl = '/placeholder-protein.svg'
              if (product.mediumImageUrls && product.mediumImageUrls.length > 0) {
                imageUrl = product.mediumImageUrls[0].imageUrl
              } else if (product.smallImageUrls && product.smallImageUrls.length > 0) {
                imageUrl = product.smallImageUrls[0].imageUrl
              }
              
              return {
                id: `rakuten_${product.shopCode}_${product.itemCode}`,
                name: product.itemName,
                description: (product.itemCaption || product.itemName).substring(0, 200) + '...',
                image: imageUrl,
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
            
            rakutenProducts.push(...convertedProducts)
          }
        } else {
          const errorText = await response.text()
          console.log(`❌ ${keyword} API失敗:`, response.status, response.statusText, errorText)
        }
      } catch (error) {
        console.error(`❌ ${keyword}の取得エラー:`, error)
      }
    }
    
    // 楽天APIから取得できた場合はそれを返す
    if (rakutenProducts.length > 0) {
      console.log(`🎉 合計${rakutenProducts.length}件の商品を楽天APIから取得成功`)
      return NextResponse.json({
        success: true,
        products: rakutenProducts,
        totalCount: rakutenProducts.length,
        lastUpdated: new Date().toISOString(),
        source: 'rakuten-api',
        message: `楽天API取得: ${rakutenProducts.length}件`
      })
    }
    
    // 楽天APIが失敗した場合は静的データを返す
    console.log('⚠️ 楽天API失敗 - 静的データ使用')
    return NextResponse.json({
      success: true,
      products: allProducts,
      totalCount: allProducts.length,
      lastUpdated: new Date().toISOString(),
      source: 'static-fallback',
      message: `静的フォールバックデータ: ${allProducts.length}件`
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