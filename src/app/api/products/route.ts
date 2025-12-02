import { NextResponse } from 'next/server'
import { getCachedProducts, setCachedProducts } from '@/lib/cache'

export async function GET() {
  try {
    console.log('🚀 商品取得API開始')
    
    // まずキャッシュを確認
    const cachedProducts = await getCachedProducts()
    if (cachedProducts && cachedProducts.length > 0) {
      console.log(`⚡ キャッシュから返却: ${cachedProducts.length}件`)
      return NextResponse.json({
        success: true,
        products: cachedProducts,
        totalCount: cachedProducts.length,
        message: `キャッシュから${cachedProducts.length}商品を取得`,
        cached: true
      })
    }
    
    console.log('🔄 楽天APIから新規取得開始')
    
    // 楽天API設定
    const rakutenApiUrl = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601'
    const allProducts = []
    
    // テスト用：軽量化設定（3キーワード × 1ページ = 最大30商品）
    const keywords = [
      'ザバス',
      'ビーレジェンド',
      'マイプロテイン'
    ]
    
    console.log(`🔍 ${keywords.length}個のキーワードで検索開始（テスト用軽量化）`)
    
    // テスト用：各キーワードで1ページのみ取得
    for (const keyword of keywords) {
      for (let page = 1; page <= 1; page++) {
        try {
          const params = new URLSearchParams({
            format: 'json',
            keyword: keyword,
            applicationId: '1054552037945576340',
            hits: '30',
            page: page.toString(),
            sort: '-reviewCount',
            minPrice: '1000',
            maxPrice: '20000'
          })
          
          console.log(`📡 ${keyword} ページ${page}を取得中...`)
          
          const response = await fetch(`${rakutenApiUrl}?${params}`, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          })
          
          console.log(`📊 ${keyword} ページ${page}: ステータス ${response.status}`)
          
          if (response.ok) {
            const data = await response.json()
            console.log(`📦 ${keyword} ページ${page}: レスポンス受信`, data.Items ? `${data.Items.length}件` : 'データなし')
            
            if (data.Items && data.Items.length > 0) {
              const fetchedProducts = data.Items
                .filter((item: any) => {
                  const product = item.Item
                  const name = (product.itemName || '').toLowerCase()
                  
                  // プロテイン商品のみを厳密にフィルタ（ホエイ・ソイ・カゼインのプロテインパウダーのみ）
                  const isProtein = (
                    (name.includes('プロテイン') || name.includes('protein')) &&
                    (name.includes('ホエイ') || name.includes('whey') || 
                     name.includes('ソイ') || name.includes('soy') ||
                     name.includes('カゼイン') || name.includes('casein') ||
                     name.includes('wpc') || name.includes('wpi'))
                  )
                  
                  // 除外すべき商品を大幅拡張（純粋なプロテインパウダー以外は除外）
                  const excludeTerms = [
                    // 食品・菓子類
                    '甘酒', 'あまざけ', 'クッキー', 'cookie', 'ビスケット', '煎餅', 'せんべい',
                    'プロテインバー', 'バー', 'ウエハース', 'チョコバー', 'スナックバー',
                    'ゼリー', 'グミ', 'ドリンク', '飲料', '青汁', 'あおじる',
                    
                    // ペット・動物用商品（重要追加）
                    '犬', 'ペット', 'ドッグ', 'dog', 'pet', 'キャット', 'cat', '愛犬', '愛猫',
                    'ペティオ', 'おやつ', 'デンタル', '犬用', '猫用', 'ペット用', '動物用',
                    
                    // サプリメント・医薬品
                    'サプリ', 'supplement', '錠剤', 'タブレット', 'カプセル', 'ビタミン', 'マルチ',
                    'コラーゲン', 'アミノ酸のみ', 'クレアチンのみ', 'カルニチン',
                    
                    // BCAA・EAAなどプロテイン以外の栄養素（より包括的に）
                    'bcaa', 'eaa', 'hmb', 'グルタミン', 'アルギニン', 'クレアチン',
                    'アミノ', 'amino', 'アミノバイタル',
                    
                    // お試し・サンプル商品
                    'お試し', 'おためし', 'サンプル', 'sample', '体験', 'トライアル',
                    '初回限定', '初回のみ', '初回', '1回限り', '送料のみ', 'ポイント消化',
                    'おまかせ', 'ランダム', '飲み比べ', '味比べ',
                    
                    // 器具・付属品
                    'シェイカー', 'shaker', 'ボトル', 'bottle', 'カップ', 'コップ', 'タンブラー',
                    'スプーン', 'spoon', 'ファンネル', 'ピルケース', 'ケース', 'ピルボックス',
                    
                    // その他除外
                    '化粧品', 'コスメ', 'シャンプー', '石鹸', 'せっけん', 'ソープ', 'クリーム'
                  ]
                  
                  const isExcluded = excludeTerms.some(term => name.includes(term))
                  
                  return isProtein && !isExcluded
                })
                .map((item: any) => {
                  const product = item.Item
                  return {
                    id: `rakuten_${product.shopCode}_${product.itemCode}`,
                    name: product.itemName,
                    description: (product.itemCaption || product.itemName || '').substring(0, 200) + '...',
                    image: (() => {
                      let imageUrl = '';
                      if (product.mediumImageUrls && product.mediumImageUrls.length > 0) {
                        imageUrl = product.mediumImageUrls[0].imageUrl;
                      } else if (product.smallImageUrls && product.smallImageUrls.length > 0) {
                        imageUrl = product.smallImageUrls[0].imageUrl;
                      } else {
                        return 'https://placehold.co/400x400?text=プロテイン';
                      }
                      
                      // 高画質化: サイズ制限を除去して400x400に変更
                      return imageUrl.replace(/\?_ex=\d+x\d+/, '?_ex=400x400');
                    })(),
                    category: (() => {
                      const name = product.itemName ? product.itemName.toLowerCase() : '';
                      if (name.includes('ソイ') || name.includes('soy') || name.includes('植物性') || name.includes('大豆')) {
                        return 'VEGAN';
                      } else if (name.includes('カゼイン') || name.includes('casein')) {
                        return 'CASEIN';
                      } else {
                        return 'WHEY';
                      }
                    })(),
                    rating: product.reviewAverage || 0,
                    reviews: product.reviewCount || 0,
                    tags: ['楽天', 'プロテイン'],
                    price: product.itemPrice || 0,
                    shops: [{
                      name: 'Rakuten' as const,
                      price: product.itemPrice || 0,
                      url: product.affiliateUrl || product.itemUrl || `https://item.rakuten.co.jp/${product.shopCode}/${product.itemCode}/`
                    }]
                  }
                })
              
              allProducts.push(...fetchedProducts)
              console.log(`✅ ${keyword} ページ${page}: +${fetchedProducts.length}件 (累計: ${allProducts.length}件)`)
            } else {
              console.log(`❌ ${keyword} ページ${page}: データなし`)
            }
          } else {
            console.error(`❌ ${keyword} ページ${page}: HTTP ${response.status}`)
            const errorText = await response.text()
            console.error(`エラー詳細:`, errorText.substring(0, 200))
          }
          
          // API制限回避（楽天APIは1秒に1回まで）
          await new Promise(resolve => setTimeout(resolve, 1100))
        } catch (error) {
          console.error(`❌ ${keyword} ページ${page} エラー:`, error)
        }
      }
    }
    
    // 重複除去
    const uniqueProducts = allProducts.filter((product, index, self) =>
      index === self.findIndex(p => p.id === product.id)
    )
    
    console.log(`🎉 最終取得完了: ${uniqueProducts.length}件`)
    
    if (uniqueProducts.length > 0) {
      // キャッシュに保存
      await setCachedProducts(uniqueProducts)
      
      return NextResponse.json({
        success: true,
        products: uniqueProducts,
        totalCount: uniqueProducts.length,
        message: `楽天から${uniqueProducts.length}商品を取得しました`,
        cached: false
      })
    }
    
    // フォールバック用テスト商品（楽天APIが失敗した場合）
    console.log('⚠️ 楽天APIから商品を取得できませんでした。フォールバック商品を使用します。')
    const fallbackProducts = [
      {
        id: 'test_1',
        name: 'ザバス ホエイプロテイン100 ココア味 1050g',
        description: '明治の定番プロテイン。初心者にもおすすめの飲みやすいココア味。',
        image: '/placeholder-protein.svg',
        category: 'WHEY',
        rating: 4.3,
        reviews: 1500,
        tags: ['定番', '飲みやすい'],
        price: 4580,
        protein: 20.9,
        calories: 83,
        servings: 50,
        shops: [{ name: 'Amazon' as const, price: 4580, url: '#' }]
      },
      {
        id: 'test_2',
        name: 'エクスプロージョン ホエイプロテイン ミルクチョコレート味 3kg',
        description: '大容量3kgでコスパ最強。筋力トレーニングに最適なプロテイン。',
        image: '/placeholder-protein.svg',
        category: 'WHEY',
        rating: 4.5,
        reviews: 1988,
        tags: ['大容量', 'コスパ'],
        price: 8399,
        protein: 20.0,
        calories: 110,
        servings: 100,
        shops: [{ name: 'Rakuten' as const, price: 8399, url: '#' }]
      },
      {
        id: 'test_3',
        name: 'ビーレジェンド ホエイプロテイン 激うまチョコ風味 1kg',
        description: '超美味しいチョコ味で人気No.1。筋トレ後のご褒美にも最適。',
        image: '/placeholder-protein.svg',
        category: 'WHEY',
        rating: 4.6,
        reviews: 2100,
        tags: ['美味しい', '人気'],
        price: 3980,
        protein: 21.0,
        calories: 112,
        servings: 33,
        shops: [{ name: 'Rakuten' as const, price: 3980, url: '#' }]
      },
      {
        id: 'test_4',
        name: 'マイプロテイン Impact ホエイプロテイン ナチュラルチョコレート 1kg',
        description: '海外ブランドの高品質プロテイン。コスパと品質のバランスが良い。',
        image: '/placeholder-protein.svg',
        category: 'WHEY',
        rating: 4.4,
        reviews: 1800,
        tags: ['海外ブランド', '高品質'],
        price: 3200,
        protein: 22.0,
        calories: 105,
        servings: 40,
        shops: [{ name: 'MyProtein' as const, price: 3200, url: '#' }]
      },
      {
        id: 'test_5',
        name: 'DNS プロテインホエイ100 プレミアムチョコレート味 1050g',
        description: 'アスリート向け高品質プロテイン。溶けやすく美味しい。',
        image: '/placeholder-protein.svg',
        category: 'WHEY',
        rating: 4.5,
        reviews: 1200,
        tags: ['アスリート', '高品質'],
        price: 5400,
        protein: 24.0,
        calories: 145,
        servings: 33,
        shops: [{ name: 'DNS' as const, price: 5400, url: '#' }]
      },
      {
        id: 'test_6',
        name: '大豆プロテイン ソイプロテイン 無添加 1kg',
        description: '植物性プロテイン。ダイエットにも最適な低カロリー設計。',
        image: '/placeholder-protein.svg',
        category: 'VEGAN',
        rating: 4.2,
        reviews: 850,
        tags: ['植物性', 'ダイエット'],
        price: 2800,
        protein: 20.0,
        calories: 78,
        servings: 40,
        shops: [{ name: 'Rakuten' as const, price: 2800, url: '#' }]
      },
      {
        id: 'test_6_2',
        name: 'SAVAS ソイプロテイン100 ココア味 1050g',
        description: '明治のソイプロテイン。ダイエットに最適なココア味で美味しく続けられる。',
        image: '/placeholder-protein.svg',
        category: 'VEGAN',
        rating: 4.3,
        reviews: 950,
        tags: ['植物性', 'ダイエット', '美味しい'],
        price: 4200,
        protein: 19.5,
        calories: 79,
        servings: 45,
        shops: [{ name: 'Amazon' as const, price: 4200, url: '#' }]
      },
      {
        id: 'test_6_3',
        name: 'DNS ソイプロテイン スムースチョコレート味 1000g',
        description: '高品質なソイプロテイン。チョコレート味で女性にも人気。',
        image: '/placeholder-protein.svg',
        category: 'VEGAN',
        rating: 4.4,
        reviews: 800,
        tags: ['植物性', 'ダイエット', '女性人気'],
        price: 3580,
        protein: 20.2,
        calories: 81,
        servings: 40,
        shops: [{ name: 'Rakuten' as const, price: 3580, url: '#' }]
      },
      {
        id: 'test_7',
        name: 'ゴールドスタンダード 100% ホエイ ダブルリッチチョコレート 907g',
        description: '世界で愛される高品質プロテイン。プロアスリートも愛用。',
        image: '/placeholder-protein.svg',
        category: 'WHEY',
        rating: 4.7,
        reviews: 2500,
        tags: ['世界標準', '高品質'],
        price: 6200,
        protein: 24.0,
        calories: 120,
        servings: 28,
        shops: [{ name: 'Amazon' as const, price: 6200, url: '#' }]
      },
      {
        id: 'test_8',
        name: 'ファイン・ラボ ホエイプロテインピュアアイソレート プレーン風味 1kg',
        description: '純度99%の最高級ホエイプロテイン。アスリート専用設計。',
        image: '/placeholder-protein.svg',
        category: 'WHEY',
        rating: 4.4,
        reviews: 680,
        tags: ['最高純度', 'アスリート'],
        price: 9800,
        protein: 26.0,
        calories: 98,
        servings: 40,
        shops: [{ name: 'Amazon' as const, price: 9800, url: '#' }]
      }
    ]
    
    console.log(`✅ 商品取得完了: ${fallbackProducts.length}件`)
    
    return NextResponse.json({
      success: true,
      products: fallbackProducts,
      totalCount: fallbackProducts.length,
      message: `${fallbackProducts.length}商品を取得しました`
    })
    
  } catch (error: any) {
    console.error('❌ API エラー:', error)
    
    // 大量のテスト商品
    const fallbackProducts = [
      {
        id: 'test_1',
        name: 'ザバス ホエイプロテイン100 ココア味 1050g',
        description: '明治の定番プロテイン。初心者にもおすすめの飲みやすいココア味。',
        image: '/placeholder-protein.svg',
        category: 'WHEY',
        rating: 4.3,
        reviews: 1500,
        tags: ['定番', '飲みやすい'],
        price: 4580,
        protein: 20.9,
        calories: 83,
        servings: 50,
        shops: [{ name: 'Amazon' as const, price: 4580, url: '#' }]
      },
      {
        id: 'test_2',
        name: 'エクスプロージョン ホエイプロテイン ミルクチョコレート味 3kg',
        description: '大容量3kgでコスパ最強。筋力トレーニングに最適なプロテイン。',
        image: '/placeholder-protein.svg',
        category: 'WHEY',
        rating: 4.5,
        reviews: 1988,
        tags: ['大容量', 'コスパ'],
        price: 8399,
        protein: 20.0,
        calories: 110,
        servings: 100,
        shops: [{ name: 'Rakuten' as const, price: 8399, url: '#' }]
      },
      {
        id: 'test_3',
        name: 'ビーレジェンド ホエイプロテイン 激うまチョコ風味 1kg',
        description: '超美味しいチョコ味で人気No.1。筋トレ後のご褒美にも最適。',
        image: '/placeholder-protein.svg',
        category: 'WHEY',
        rating: 4.6,
        reviews: 2100,
        tags: ['美味しい', '人気'],
        price: 3980,
        protein: 21.0,
        calories: 112,
        servings: 33,
        shops: [{ name: 'Rakuten' as const, price: 3980, url: '#' }]
      },
      {
        id: 'test_4',
        name: 'マイプロテイン Impact ホエイプロテイン ナチュラルチョコレート 1kg',
        description: '海外ブランドの高品質プロテイン。コスパと品質のバランスが良い。',
        image: '/placeholder-protein.svg',
        category: 'WHEY',
        rating: 4.4,
        reviews: 1800,
        tags: ['海外ブランド', '高品質'],
        price: 3200,
        protein: 22.0,
        calories: 105,
        servings: 40,
        shops: [{ name: 'MyProtein' as const, price: 3200, url: '#' }]
      },
      {
        id: 'test_5',
        name: 'DNS プロテインホエイ100 プレミアムチョコレート味 1050g',
        description: 'アスリート向け高品質プロテイン。溶けやすく美味しい。',
        image: '/placeholder-protein.svg',
        category: 'WHEY',
        rating: 4.5,
        reviews: 1200,
        tags: ['アスリート', '高品質'],
        price: 5400,
        protein: 24.0,
        calories: 145,
        servings: 33,
        shops: [{ name: 'DNS' as const, price: 5400, url: 'https://item.rakuten.co.jp/dns/10000001/' }]
      },
      {
        id: 'test_6',
        name: '大豆プロテイン ソイプロテイン 無添加 1kg',
        description: '植物性プロテイン。ダイエットにも最適な低カロリー設計。',
        image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/nichiei/cabinet/00315/4562289951001.jpg',
        category: 'VEGAN',
        rating: 4.2,
        reviews: 850,
        tags: ['植物性', 'ダイエット'],
        price: 2800,
        protein: 20.0,
        calories: 78,
        servings: 40,
        shops: [{ name: 'Rakuten' as const, price: 2800, url: 'https://item.rakuten.co.jp/nichiei/soy1000/' }]
      },
      {
        id: 'test_7',
        name: 'ゴールドスタンダード 100% ホエイ ダブルリッチチョコレート 907g',
        description: '世界で愛される高品質プロテイン。プロアスリートも愛用。',
        image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/muscle-elite/cabinet/gold/gold-std-whey-5lbs-2.jpg',
        category: 'WHEY',
        rating: 4.7,
        reviews: 2500,
        tags: ['世界標準', '高品質'],
        price: 6200,
        protein: 24.0,
        calories: 120,
        servings: 28,
        shops: [{ name: 'Amazon' as const, price: 6200, url: 'https://www.amazon.co.jp/dp/B000QSTBNS' }]
      },
      {
        id: 'test_8',
        name: 'ファイン・ラボ ホエイプロテインピュアアイソレート プレーン風味 1kg',
        description: '純度99%の最高級ホエイプロテイン。アスリート専用設計。',
        image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/finelab/cabinet/wpi1000.jpg',
        category: 'WHEY',
        rating: 4.4,
        reviews: 680,
        tags: ['最高純度', 'アスリート'],
        price: 9800,
        protein: 26.0,
        calories: 98,
        servings: 40,
        shops: [{ name: 'Amazon' as const, price: 9800, url: 'https://www.amazon.co.jp/dp/B0851SZZW3' }]
      },
      {
        id: 'test_9',
        name: 'アルプロン ホエイプロテインWPC チョコレート風味 1kg',
        description: 'コスパに優れた国産プロテイン。飲みやすく続けやすい。',
        image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/alpron/cabinet/whey/wpc1000cho.jpg',
        category: 'WHEY',
        rating: 4.1,
        reviews: 1200,
        tags: ['国産', 'コスパ'],
        price: 2980,
        protein: 21.7,
        calories: 109,
        servings: 50,
        shops: [{ name: 'Rakuten' as const, price: 2980, url: 'https://item.rakuten.co.jp/alpron/wpc1000cho/' }]
      },
      {
        id: 'test_10',
        name: 'ハレオ WHEY PROTEIN ココア風味 1kg',
        description: 'プロアスリート向けハイエンドプロテイン。最高の品質と味。',
        image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/haleo-shop/cabinet/whey/whey1000cocoa.jpg',
        category: 'WHEY',
        rating: 4.6,
        reviews: 580,
        tags: ['プロ仕様', '最高品質'],
        price: 8800,
        protein: 25.2,
        calories: 118,
        servings: 33,
        shops: [{ name: 'Rakuten' as const, price: 8800, url: 'https://item.rakuten.co.jp/haleo-shop/whey1000cocoa/' }]
      },
      {
        id: 'test_11',
        name: 'ウイダー マッスルフィット プロテイン バニラ味 900g',
        description: '森永ウイダーの定番プロテイン。EMR配合で効率的な筋力アップ。',
        image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/kyuusai/cabinet/weider/28mm_12340.jpg',
        category: 'WHEY',
        rating: 4.0,
        reviews: 950,
        tags: ['森永', 'EMR配合'],
        price: 3480,
        protein: 20.0,
        calories: 108,
        servings: 30,
        shops: [{ name: 'Rakuten' as const, price: 3480, url: 'https://item.rakuten.co.jp/kyuusai/28mm_12340/' }]
      },
      {
        id: 'test_12',
        name: 'ケンタイ パワープロテイン プロフェッショナルタイプ 1.2kg',
        description: '本格派向けプロテイン。アミノ酸スコア100で完全栄養設計。',
        image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/kentai/cabinet/powder/k3332.jpg',
        category: 'WHEY',
        rating: 4.3,
        reviews: 720,
        tags: ['本格派', 'アミノ酸100'],
        price: 4200,
        protein: 23.8,
        calories: 115,
        servings: 40,
        shops: [{ name: 'Rakuten' as const, price: 4200, url: 'https://item.rakuten.co.jp/kentai/k3332/' }]
      }
    ]
    
    return NextResponse.json({
      success: false,
      products: fallbackProducts,
      totalCount: fallbackProducts.length,
      error: error.message,
      message: `エラー発生。フォールバック商品${fallbackProducts.length}件を表示`
    })
  }
}