import { NextResponse } from 'next/server'
import { loadFeaturedProductsCache } from '@/lib/cache'

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
  {
    id: 'fallback_whey_004',
    name: 'エクスプロージョン ホエイプロテイン ミルクチョコレート味 3kg',
    description: '大容量3kgでコスパ抜群。有名店のような絶品チョコレート風味。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/explosion/cabinet/06151095/06151098/explosion-choco3kg.jpg?_ex=500x500',
    category: 'WHEY',
    rating: 4.5,
    reviews: 1800,
    tags: ['大容量', '業務用'],
    price: 8399,
    protein: 20.9,
    calories: 117,
    servings: 100,
    shops: [{ name: 'Rakuten' as const, price: 8399, url: 'https://item.rakuten.co.jp/explosion/explosion-choco3kg/' }]
  },
  
  // ソイプロテイン
  {
    id: 'fallback_soy_001',
    name: 'ソイプロテイン 大豆プロテイン ココア味 1kg',
    description: '植物性プロテインで美容と健康をサポート。女性にも人気。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/nichiga/cabinet/06151095/06151098/soy-cocoa1kg.jpg?_ex=500x500',
    category: 'VEGAN',
    rating: 4.3,
    reviews: 2100,
    tags: ['植物性', '美容'],
    price: 3280,
    protein: 18.5,
    calories: 105,
    servings: 33,
    shops: [{ name: 'Rakuten' as const, price: 3280, url: 'https://item.rakuten.co.jp/nichiga/soy-cocoa1kg/' }]
  },
  {
    id: 'fallback_soy_002',
    name: 'アストリション ジュニアプロテイン ココア味 600g',
    description: '砂糖・人工甘味料無添加。成長期のお子様の栄養補給に。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/astrition/cabinet/06151095/06151098/junior-cocoa600g.jpg?_ex=500x500',
    category: 'VEGAN',
    rating: 4.7,
    reviews: 5000,
    tags: ['無添加', '子供用'],
    price: 4380,
    protein: 17.2,
    calories: 98,
    servings: 20,
    shops: [{ name: 'Rakuten' as const, price: 4380, url: 'https://item.rakuten.co.jp/astrition/junior-cocoa600g/' }]
  },
  {
    id: 'fallback_soy_003',
    name: 'uFit ソイプロテイン 抹茶味 750g',
    description: '人工甘味料不使用。自然な甘さと溶けやすさを実現。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/ufit/cabinet/06151095/06151098/ufit-matcha750g.jpg?_ex=500x500',
    category: 'VEGAN',
    rating: 4.6,
    reviews: 2500,
    tags: ['無添加', '抹茶'],
    price: 4280,
    protein: 17.8,
    calories: 102,
    servings: 25,
    shops: [{ name: 'Rakuten' as const, price: 4280, url: 'https://item.rakuten.co.jp/ufit/ufit-matcha750g/' }]
  },
  
  // カゼインプロテイン
  {
    id: 'fallback_casein_001',
    name: 'カゼインミセルプロテイン プレーン味 500g',
    description: '就寝前に最適。ゆっくり吸収されるミルクプロテイン。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/bulksports/cabinet/06151095/06151098/casein-plain500g.jpg?_ex=500x500',
    category: 'CASEIN',
    rating: 4.3,
    reviews: 180,
    tags: ['就寝前', 'ゆっくり吸収'],
    price: 1899,
    protein: 24.0,
    calories: 115,
    servings: 17,
    shops: [{ name: 'Rakuten' as const, price: 1899, url: 'https://item.rakuten.co.jp/bulksports/casein-plain500g/' }]
  },
  {
    id: 'fallback_casein_002',
    name: 'バルクスポーツ ビッグカゼイン ナチュラル 1kg',
    description: '良質なカゼインミセルを豊富に含有。腹持ちが良くダイエットにも。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/bulksports/cabinet/06151095/06151098/big-casein1kg.jpg?_ex=500x500',
    category: 'CASEIN',
    rating: 4.4,
    reviews: 320,
    tags: ['ダイエット', '腹持ち'],
    price: 6480,
    protein: 23.5,
    calories: 108,
    servings: 33,
    shops: [{ name: 'Rakuten' as const, price: 6480, url: 'https://item.rakuten.co.jp/bulksports/big-casein1kg/' }]
  },
  
  // 人気ブランド追加
  {
    id: 'fallback_popular_001',
    name: 'DNS プロテインホエイ100 チョコレート風味 1050g',
    description: 'アスリート御用達ブランド。高品質ホエイプロテイン100%。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/dns-shop/cabinet/06151095/06151098/dns-whey-choco1050g.jpg?_ex=500x500',
    category: 'WHEY',
    rating: 4.7,
    reviews: 1200,
    tags: ['DNS', 'アスリート'],
    price: 5400,
    protein: 24.2,
    calories: 142,
    servings: 35,
    shops: [{ name: 'Rakuten' as const, price: 5400, url: 'https://item.rakuten.co.jp/dns-shop/dns-whey-choco1050g/' }]
  },
  {
    id: 'fallback_popular_002',
    name: 'アルプロン ホエイプロテイン ストロベリー風味 750g',
    description: 'プロテインマイスター受賞商品。美味しさと品質を追求。',
    image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/alpron/cabinet/06151095/06151098/alpron-strawberry750g.jpg?_ex=500x500',
    category: 'WHEY',
    rating: 4.4,
    reviews: 2800,
    tags: ['受賞', 'ストロベリー'],
    price: 3890,
    protein: 17.4,
    calories: 109,
    servings: 25,
    shops: [{ name: 'Rakuten' as const, price: 3890, url: 'https://item.rakuten.co.jp/alpron/alpron-strawberry750g/' }]
  },
  
  // 追加のフォールバック商品（デモ用に大幅増量）
  {
    id: 'fallback_whey_004',
    name: 'ゴールドジム ホエイプロテイン チョコレート風味 720g',
    description: 'フィットネス業界のリーディングブランド。',
    image: '/placeholder-protein.svg',
    category: 'WHEY',
    rating: 4.5,
    reviews: 850,
    tags: ['ゴールドジム', 'チョコ'],
    price: 5980,
    protein: 21.3,
    calories: 115,
    servings: 24,
    shops: [{ name: 'Rakuten' as const, price: 5980, url: '#' }]
  },
  {
    id: 'fallback_whey_005',
    name: 'Kentai パワープロテイン プロフェッショナルタイプ 1.2kg',
    description: '本格派アスリート向け高品質プロテイン。',
    image: '/placeholder-protein.svg',
    category: 'WHEY',
    rating: 4.6,
    reviews: 1200,
    tags: ['Kentai', 'アスリート'],
    price: 7200,
    protein: 22.1,
    calories: 118,
    servings: 40,
    shops: [{ name: 'Rakuten' as const, price: 7200, url: '#' }]
  },
  {
    id: 'fallback_whey_006',
    name: 'オプティマム ゴールドスタンダード 100% ホエイ 1kg',
    description: '世界No.1シェアの海外ブランド。高品質WPI配合。',
    image: '/placeholder-protein.svg',
    category: 'WHEY',
    rating: 4.8,
    reviews: 3500,
    tags: ['海外', 'WPI', 'No.1'],
    price: 6800,
    protein: 24.0,
    calories: 120,
    servings: 29,
    shops: [{ name: 'Rakuten' as const, price: 6800, url: '#' }]
  },
  {
    id: 'fallback_soy_003',
    name: '大豆プロテイン 無添加 プレーン味 1kg',
    description: '100%大豆由来。砂糖・人工甘味料・香料不使用。',
    image: '/placeholder-protein.svg',
    category: 'VEGAN',
    rating: 4.2,
    reviews: 1800,
    tags: ['無添加', 'プレーン', '大豆100%'],
    price: 2980,
    protein: 18.2,
    calories: 98,
    servings: 33,
    shops: [{ name: 'Rakuten' as const, price: 2980, url: '#' }]
  },
  {
    id: 'fallback_soy_004',
    name: 'ウェリナ ソイプロテイン ココア味 500g',
    description: '女性に人気の美容成分配合ソイプロテイン。',
    image: '/placeholder-protein.svg',
    category: 'VEGAN',
    rating: 4.4,
    reviews: 2200,
    tags: ['女性向け', '美容', 'ココア'],
    price: 3280,
    protein: 16.8,
    calories: 105,
    servings: 17,
    shops: [{ name: 'Rakuten' as const, price: 3280, url: '#' }]
  },
  {
    id: 'fallback_casein_003',
    name: 'ミセラーカゼイン プレミアム バニラ味 1kg',
    description: '夜間の筋肉分解を防ぐスロープロテイン。',
    image: '/placeholder-protein.svg',
    category: 'CASEIN',
    rating: 4.3,
    reviews: 420,
    tags: ['カゼイン', '夜用', 'バニラ'],
    price: 5400,
    protein: 23.8,
    calories: 112,
    servings: 33,
    shops: [{ name: 'Rakuten' as const, price: 5400, url: '#' }]
  },
  {
    id: 'fallback_mix_001',
    name: 'WPI+WPC ミックスプロテイン チョコレート味 1kg',
    description: 'WPIとWPCの良いとこ取り。コスパと品質を両立。',
    image: '/placeholder-protein.svg',
    category: 'WHEY',
    rating: 4.5,
    reviews: 1650,
    tags: ['WPI+WPC', 'ミックス', 'コスパ'],
    price: 4580,
    protein: 20.5,
    calories: 116,
    servings: 33,
    shops: [{ name: 'Rakuten' as const, price: 4580, url: '#' }]
  },
  {
    id: 'fallback_diet_001', 
    name: 'ダイエットサポートプロテイン カフェオレ味 600g',
    description: 'L-カルニチン配合でダイエットをサポート。',
    image: '/placeholder-protein.svg',
    category: 'WHEY',
    rating: 4.1,
    reviews: 980,
    tags: ['ダイエット', 'L-カルニチン', 'カフェオレ'],
    price: 3980,
    protein: 18.5,
    calories: 95,
    servings: 20,
    shops: [{ name: 'Rakuten' as const, price: 3980, url: '#' }]
  },
  {
    id: 'fallback_junior_001',
    name: 'ジュニアプロテイン 成長サポート ミルク味 400g',
    description: '成長期のお子様向け。カルシウム・鉄分配合。',
    image: '/placeholder-protein.svg',
    category: 'WHEY',
    rating: 4.7,
    reviews: 3200,
    tags: ['ジュニア', '成長サポート', 'ミルク'],
    price: 2680,
    protein: 16.2,
    calories: 102,
    servings: 13,
    shops: [{ name: 'Rakuten' as const, price: 2680, url: '#' }]
  }
]

// キャッシュされた商品データを返すAPI（フロントエンド用）
export async function GET() {
  try {
    console.log('📖 キャッシュデータ読み込み開始')
    
    // キャッシュからデータを取得
    const cacheData = await loadFeaturedProductsCache()
    
    // デバッグ情報を追加
    console.log('🔍 キャッシュデータチェック:', {
      hasData: !!cacheData,
      dataType: typeof cacheData,
      dataKeys: cacheData ? Object.keys(cacheData) : 'none',
      hasCategories: cacheData?.categories ? 'yes' : 'no',
      categoriesLength: cacheData?.categories?.length || 0
    })
    
    if (!cacheData) {
      console.log('⚠️ キャッシュデータが見つかりません - 楽天APIから直接取得を試行')
      
      // 楽天APIから直接取得を試行
      try {
        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://protein-lyart.vercel.app'
        const rakutenUrl = `${baseUrl}/api/rakuten?keyword=プロテイン&page=1`
        console.log('🌐 楽天API緊急取得URL:', rakutenUrl)
        const rakutenResponse = await fetch(rakutenUrl)
        if (rakutenResponse.ok) {
          const rakutenData = await rakutenResponse.json()
          if (rakutenData.success && rakutenData.products?.length > 0) {
            console.log(`✅ 楽天APIから${rakutenData.products.length}件取得 - 緊急代替データとして使用`)
            
            // 楽天APIデータを統一形式に変換
            const convertedProducts = rakutenData.products.map((product: any) => ({
              id: product.id,
              name: product.name,
              description: product.description || '',
              image: product.imageUrl || '/placeholder-protein.svg',
              category: 'WHEY',
              rating: product.reviewAverage || 0,
              reviews: product.reviewCount || 0,
              tags: ['楽天', '直接取得'],
              price: product.price || 0,
              protein: product.nutrition?.protein || 20,
              calories: product.nutrition?.calories || 110,
              servings: product.nutrition?.servings || 30,
              shops: [{
                name: 'Rakuten' as const,
                price: product.price || 0,
                url: product.affiliateUrl || '#'
              }]
            }))
            
            return NextResponse.json({
              success: true,
              products: convertedProducts,
              totalCount: convertedProducts.length,
              lastUpdated: new Date().toISOString(),
              source: 'rakuten-api-emergency',
              message: `楽天API緊急取得: ${convertedProducts.length}件`
            })
          }
        }
      } catch (apiError) {
        console.error('🚨 楽天API緊急取得も失敗:', apiError)
      }
      
      console.log('💾 最終手段：フォールバックデータを使用')
      return NextResponse.json({
        success: true,
        products: fallbackProducts,
        totalCount: fallbackProducts.length,
        lastUpdated: new Date().toISOString(),
        source: 'fallback',
        message: 'キャッシュ未初期化 - フォールバックデータを表示中'
      })
    }

    // キャッシュデータを統一形式に変換
    let products: any[] = []
    
    if (cacheData.categories && Array.isArray(cacheData.categories)) {
      // 全カテゴリの商品をフラットに展開
      products = cacheData.categories.flatMap((category: any) => {
        if (category.products && Array.isArray(category.products)) {
          return category.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            description: product.description || '',
            image: product.imageUrl || '/placeholder-protein.svg',
            category: mapCategoryToStandard(product.category || 'WHEY'),
            rating: product.reviewAverage || 0,
            reviews: product.reviewCount || 0,
            tags: ['楽天', 'キャッシュ'],
            price: product.price || 0,
            protein: product.nutrition?.protein || 20,
            calories: product.nutrition?.calories || 110,
            servings: product.nutrition?.servings || 30,
            shops: [{
              name: 'Rakuten' as const,
              price: product.price || 0,
              url: product.affiliateUrl || '#'
            }]
          }))
        }
        return []
      })
    }
    
    console.log(`✅ キャッシュから${products.length}件の商品を取得`)
    
    return NextResponse.json({
      success: true,
      products: products,
      totalCount: products.length,
      lastUpdated: cacheData.lastUpdated,
      source: 'cache',
      message: `キャッシュから${products.length}件取得`
    })

  } catch (error: any) {
    console.error('❌ キャッシュデータ読み込みエラー:', error)
    return NextResponse.json({
      success: false,
      error: 'キャッシュデータの読み込みに失敗しました',
      details: error.message
    }, { status: 500 })
  }
}

// カテゴリ名を標準形式にマッピング
function mapCategoryToStandard(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'whey': 'WHEY',
    'soy': 'VEGAN',
    'casein': 'CASEIN',
    'wpi': 'WHEY',
    'all_protein': 'WHEY',
    'popular_protein': 'WHEY',
    'recommended_protein': 'WHEY',
    'savas': 'WHEY',
    'dns': 'WHEY',
    'belegend': 'WHEY',
    'myprotein': 'WHEY',
    'alpron': 'WHEY',
    'xplosion': 'WHEY',
    'valx': 'WHEY',
    'goldsgym': 'WHEY',
    'diet': 'VEGAN',
    'muscle': 'WHEY',
    'beauty': 'VEGAN',
    'plant': 'VEGAN'
  }
  
  return categoryMap[category] || 'WHEY'
}