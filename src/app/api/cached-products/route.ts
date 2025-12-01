import { NextResponse } from 'next/server'
import { loadFeaturedProductsCache } from '@/lib/cache'

export async function GET() {
  try {
    console.log('🎯 キャッシュから商品データを取得開始')
    
    // キャッシュからデータを読み込み
    const cacheData = await loadFeaturedProductsCache()
    
    if (!cacheData) {
      console.log('⚠️ キャッシュデータなし - 楽天API直接呼び出し')
      return await fallbackToRakutenAPI()
    }

    // キャッシュデータの形式確認
    console.log('🔍 キャッシュデータ構造:', {
      hasCategories: !!(cacheData.categories),
      categoriesLength: cacheData.categories?.length || 0,
      isArray: Array.isArray(cacheData.categories)
    })

    if (cacheData.categories && Array.isArray(cacheData.categories)) {
      // カテゴリから全商品を平坦化して変換
      const allProducts = cacheData.categories.flatMap((category: any) => {
        if (!category.products || !Array.isArray(category.products)) {
          console.warn('カテゴリに商品がありません:', category.categoryName || 'unknown')
          return []
        }

        return category.products.map((product: any) => {
          try {
            return {
              id: product.id,
              name: product.name,
              description: product.description || '',
              image: product.imageUrl || product.image || '/placeholder-protein.svg',
              category: mapCategory(product.type || category.category || 'WHEY'),
              rating: product.reviewAverage || product.rating || 0,
              reviews: product.reviewCount || product.reviews || 0,
              tags: extractTags(product),
              price: product.price || 0,
              protein: product.nutrition?.protein || 20,
              calories: product.nutrition?.calories || 110,
              servings: product.nutrition?.servings || 30,
              shops: [{
                name: 'Rakuten' as const,
                price: product.price || 0,
                url: product.affiliateUrl || '#'
              }]
            }
          } catch (error) {
            console.warn('商品変換エラー:', error, product.name || 'unknown')
            return null
          }
        }).filter(Boolean) // null除去
      })

      console.log(`✅ キャッシュから商品データを取得完了: ${allProducts.length}商品`)

      return NextResponse.json({
        success: true,
        products: allProducts,
        totalCount: allProducts.length,
        lastUpdated: cacheData.lastUpdated || new Date().toISOString(),
        source: 'cache',
        message: `キャッシュから${allProducts.length}商品を取得`
      })
    }

    // キャッシュ形式が不正な場合は楽天APIにフォールバック
    console.log('⚠️ キャッシュ形式が不正 - 楽天APIにフォールバック')
    return await fallbackToRakutenAPI()

  } catch (error: any) {
    console.error('❌ キャッシュ読み込みエラー:', error)
    return await fallbackToRakutenAPI()
  }
}

// カテゴリマッピング
function mapCategory(type: string): string {
  const typeStr = type.toLowerCase()
  if (typeStr.includes('whey') || typeStr.includes('ホエイ')) return 'WHEY'
  if (typeStr.includes('soy') || typeStr.includes('ソイ') || typeStr.includes('大豆')) return 'VEGAN'
  if (typeStr.includes('casein') || typeStr.includes('カゼイン')) return 'CASEIN'
  return 'WHEY' // デフォルト
}

// タグ抽出
function extractTags(product: any): string[] {
  const tags = ['プロテイン']
  const name = (product.name || '').toLowerCase()
  
  if (product.brand) tags.push(product.brand)
  if (name.includes('ザバス')) tags.push('ザバス')
  if (name.includes('dns')) tags.push('DNS')
  if (name.includes('ビーレジェンド')) tags.push('ビーレジェンド')
  if (name.includes('3kg')) tags.push('大容量')
  if (name.includes('チョコ')) tags.push('チョコ味')
  if (name.includes('バニラ')) tags.push('バニラ味')
  if (name.includes('ストロベリー') || name.includes('いちご')) tags.push('ストロベリー味')
  
  return tags
}

// 楽天APIフォールバック
async function fallbackToRakutenAPI() {
  try {
    const rakutenApiUrl = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601'
    const params = new URLSearchParams({
      format: 'json',
      keyword: 'プロテイン',
      applicationId: '1054552037945576340',
      hits: '30',
      page: '1',
      sort: 'reviewCount'
    })
    
    const response = await fetch(`${rakutenApiUrl}?${params}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`楽天API失敗: ${response.status}`)
    }
    
    const data = await response.json()
    
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
    
    console.log(`✅ 楽天APIフォールバック: ${products.length}商品`)
    
    return NextResponse.json({
      success: true,
      products: products,
      totalCount: products.length,
      lastUpdated: new Date().toISOString(),
      source: 'rakuten-fallback',
      message: `楽天API直接取得: ${products.length}件`
    })
    
  } catch (error: any) {
    console.error('❌ 楽天APIフォールバックも失敗:', error)
    
    // 最終フォールバック
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
      },
      {
        id: 'fb002',
        name: 'ザバス ホエイプロテイン100 ココア味 1050g',
        description: '明治の定番プロテイン。初心者にもおすすめの飲みやすいココア味。',
        image: '/placeholder-protein.svg',
        category: 'WHEY',
        rating: 4.2,
        reviews: 1542,
        tags: ['定番', '飲みやすい'],
        price: 4580,
        protein: 20.9,
        calories: 83,
        servings: 50,
        shops: [{ name: 'Amazon' as const, price: 4580, url: '#' }]
      }
    ]
    
    return NextResponse.json({
      success: false,
      products: fallbackProducts,
      totalCount: fallbackProducts.length,
      lastUpdated: new Date().toISOString(),
      source: 'error-fallback',
      error: error.message,
      message: 'エラー時最終フォールバック'
    })
  }
}