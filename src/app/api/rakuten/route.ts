import { NextRequest, NextResponse } from 'next/server'
import { isValidProteinProduct, extractProteinTypes, extractBrand, extractNutrition, extractCategory } from '@/lib/proteinFilter'

// 楽天商品検索API統合
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get('keyword') || 'プロテイン'
  const page = parseInt(searchParams.get('page') || '1')
  
  // 楽天APIキー（環境変数またはヘッダーから取得）
  const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID || request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!RAKUTEN_APP_ID) {
    return NextResponse.json({ 
      error: '楽天APIキーが設定されていません',
      message: 'RAKUTEN_APP_IDを環境変数に設定するか、Authorizationヘッダーで送信してください'
    }, { status: 500 })
  }

  try {
    // 楽天商品検索API呼び出し（動作確認済みの形式）
    const apiUrl = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?` +
      `applicationId=${RAKUTEN_APP_ID}&` +
      `keyword=${encodeURIComponent(keyword)}&` +
      `page=${page}&` +
      `hits=30&` +
      `formatVersion=2`

    console.log('楽天API URL:', apiUrl.replace(RAKUTEN_APP_ID, 'APP_ID_HIDDEN'))
    console.log('楽天API 呼び出し開始...')

    const response = await fetch(apiUrl)
    
    console.log('楽天API レスポンス:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('楽天API エラーレスポンス:', errorText)
      throw new Error(`楽天API エラー: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    
    // プロテイン商品データを整形
    const proteins = data.Items?.map((item: any) => {
      const product = item.Item || item // 楽天APIの構造に対応
      
      if (!product || !product.itemCode) {
        console.warn('商品データが不正:', item)
        return null
      }
      
      const description = product.itemCaption?.replace(/<[^>]*>/g, '') || ''
      const nutrition = extractNutrition(product.itemName, description)
      
      return {
        id: product.itemCode,
        name: product.itemName,
        brand: extractBrand(product.itemName),
        price: product.itemPrice,
        pricePerServing: Math.round(product.itemPrice / nutrition.servings),
        imageUrl: getHighQualityImageUrl(product.mediumImageUrls?.[0] || product.smallImageUrls?.[0] || ''),
        shopName: product.shopName,
        reviewCount: product.reviewCount,
        reviewAverage: product.reviewAverage,
        description: description.substring(0, 200) + '...',
        url: product.itemUrl,
        affiliateUrl: product.affiliateUrl,
        tags: ['楽天', 'プロテイン'],
        type: extractProteinTypes(product.itemName),
        category: extractCategory(product.itemName),
        features: nutrition,
        source: 'rakuten',
        lastUpdated: new Date().toISOString()
      }
    }).filter(Boolean) || [] // null値を除外

    // プロテイン関連商品のみフィルタリング（統一フィルター使用）
    const filteredProteins = proteins.filter((protein: any) => 
      protein && isValidProteinProduct(protein.name, protein.description)
    )

    return NextResponse.json({
      success: true,
      products: filteredProteins,
      totalCount: data.count,
      page: data.page,
      pageCount: Math.ceil(data.count / 30),
      source: 'rakuten'
    })

  } catch (error: any) {
    console.error('楽天API エラー:', error)
    return NextResponse.json({ 
      error: '商品取得中にエラーが発生しました',
      details: error.message 
    }, { status: 500 })
  }
}

// 高品質画像URL取得（楽天の画像サイズを500x500に変更）
function getHighQualityImageUrl(originalUrl: string): string {
  if (!originalUrl) return '';
  
  // 楽天の画像URLの場合、サイズパラメータを変更
  if (originalUrl.includes('thumbnail.image.rakuten.co.jp')) {
    // ?_ex=128x128 を ?_ex=500x500 に変更
    return originalUrl.replace(/\?_ex=\d+x\d+/, '?_ex=500x500');
  }
  
  return originalUrl;
}

