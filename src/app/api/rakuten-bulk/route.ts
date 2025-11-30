import { NextRequest, NextResponse } from 'next/server'
import { isValidProteinProduct, extractProteinTypes, extractBrand, extractNutrition } from '@/lib/proteinFilter'

// 楽天市場の全プロテイン商品を一括取得
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const appId = searchParams.get('appId') || '1054552037945576340'
  const maxPages = parseInt(searchParams.get('maxPages') || '10') // 最大10ページ（300件）
  
  console.log(`楽天 全商品取得開始: 最大${maxPages}ページ`)
  
  const allProducts: any[] = []
  let currentPage = 1
  let totalPages = 1

  try {
    // ページごとに順次取得
    while (currentPage <= maxPages && currentPage <= totalPages) {
      const apiUrl = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?` +
        `applicationId=${appId}&` +
        `keyword=プロテイン&` +
        `page=${currentPage}&` +
        `hits=30&` +
        `formatVersion=2`

      console.log(`ページ ${currentPage} 取得中...`)
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error(`楽天API エラー (ページ${currentPage}): ${response.status}`)
      }

      const data = await response.json()
      
      // 最初のページで総ページ数を計算
      if (currentPage === 1) {
        totalPages = Math.ceil((data.count || 0) / 30)
        console.log(`総商品数: ${data.count}件、総ページ数: ${totalPages}ページ`)
      }

      // 商品データを変換して配列に追加
      if (data.Items) {
        const pageProducts = data.Items.map((item: any) => {
          const product = item.Item || item
          const description = product.itemCaption?.replace(/<[^>]*>/g, '') || ''
          const itemName = product.itemName || ''
          
          // 統一栄養成分抽出を使用
          const nutrition = extractNutrition(itemName, description)
          
          return {
            id: product.itemCode || Math.random().toString(36),
            name: itemName,
            brand: extractBrand(itemName),
            price: parseInt(product.itemPrice) || 0,
            pricePerServing: Math.round((parseInt(product.itemPrice) || 0) / nutrition.servings),
            imageUrl: product.mediumImageUrls?.[0] || product.smallImageUrls?.[0] || '',
            shopName: product.shopName || 'ショップ不明',
            reviewCount: product.reviewCount || 0,
            reviewAverage: parseFloat(product.reviewAverage) || 0,
            description: description.substring(0, 200) + '...',
            url: product.itemUrl || '',
            affiliateUrl: product.affiliateUrl || product.itemUrl || '',
            tags: ['楽天', 'プロテイン'],
            type: extractProteinTypes(itemName),
            features: nutrition,
            source: 'rakuten',
            lastUpdated: new Date().toISOString()
          }
        })

        allProducts.push(...pageProducts)
        console.log(`ページ ${currentPage} 完了: ${pageProducts.length}件 (累計: ${allProducts.length}件)`)
      }

      currentPage++
      
      // API制限対策：1秒待機
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // プロテイン関連商品のみフィルタリング（統一フィルター使用）
    const proteinProducts = allProducts.filter(product => isValidProteinProduct(product.name, product.description))

    console.log(`取得完了: 全${allProducts.length}件中、プロテイン商品${proteinProducts.length}件`)

    return NextResponse.json({
      success: true,
      message: `楽天市場から${proteinProducts.length}件のプロテイン商品を取得しました`,
      products: proteinProducts,
      totalCount: proteinProducts.length,
      pagesProcessed: currentPage - 1,
      totalPages: totalPages,
      source: 'rakuten-bulk'
    })

  } catch (error: any) {
    console.error('楽天一括取得エラー:', error)
    return NextResponse.json({
      success: false,
      error: '一括取得中にエラーが発生しました',
      details: error.message,
      products: allProducts,
      totalCount: allProducts.length,
      lastPage: currentPage - 1
    }, { status: 500 })
  }
}

