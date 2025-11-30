const fs = require('fs')
const path = require('path')

// ローカルキャッシュファイルから本番環境のキャッシュAPIに直接アップロード
async function uploadCacheToProduction() {
  try {
    console.log('🚀 ローカルキャッシュデータを本番環境に転送開始...')
    
    // ローカルキャッシュファイル読み込み
    const cacheFilePath = path.join(process.cwd(), 'cache', 'products.json')
    
    if (!fs.existsSync(cacheFilePath)) {
      console.error('❌ ローカルキャッシュファイルが見つかりません:', cacheFilePath)
      return
    }
    
    const localCacheData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'))
    console.log('✅ ローカルキャッシュ読み込み完了:', new Date().toLocaleString())
    console.log(`📊 データ概要: ${localCacheData.data.categories.length}カテゴリ`)
    
    // 本番環境のキャッシュデータAPIに直接POST送信
    const productionUrls = [
      'https://protein-tyart.vercel.app',
      'https://protein-inhncg7fo-kotaro199906-gmailcoms-projects.vercel.app'
    ]
    
    for (const baseUrl of productionUrls) {
      try {
        console.log(`📡 ${baseUrl} にデータ転送中...`)
        
        const response = await fetch(`${baseUrl}/api/upload-cache-data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer update-cache-from-local'
          },
          body: JSON.stringify(localCacheData.data)
        })
        
        if (response.ok) {
          const result = await response.json()
          console.log(`✅ ${baseUrl} 転送成功:`, result.message)
        } else {
          console.log(`⚠️ ${baseUrl} 転送スキップ: ${response.status}`)
        }
      } catch (error) {
        console.log(`⚠️ ${baseUrl} 転送エラー:`, error.message)
      }
    }
    
    console.log('🎉 キャッシュデータ転送処理完了!')
    
  } catch (error) {
    console.error('❌ 転送処理エラー:', error)
  }
}

// 実行
uploadCacheToProduction()