import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'status'
  
  try {
    const debugInfo: any = {
      timestamp: new Date().toLocaleString('ja-JP'),
      environment: process.env.NODE_ENV,
      vercelKV: {
        hasUrl: !!process.env.KV_REST_API_URL,
        hasToken: !!process.env.KV_REST_API_TOKEN,
        url: process.env.KV_REST_API_URL ? `${process.env.KV_REST_API_URL.substring(0, 20)}...` : 'not set'
      }
    }
    
    // Vercel KVの状況を確認
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const { kv } = await import('@vercel/kv')
        
        if (action === 'check') {
          // キャッシュキーの存在確認
          const data = await kv.get('featured-products')
          const timestamp = await kv.get('featured-products-timestamp')
          
          debugInfo.cache = {
            hasData: !!data,
            dataType: typeof data,
            dataSize: data ? (typeof data === 'string' ? data.length : JSON.stringify(data).length) : 0,
            hasTimestamp: !!timestamp,
            timestamp: timestamp
          }
          
          if (data) {
            try {
              const parsed = typeof data === 'string' ? JSON.parse(data) : data
              debugInfo.cacheContent = {
                success: parsed.success,
                categories: parsed.categories?.length || 0,
                totalCategories: parsed.totalCategories,
                lastUpdated: parsed.lastUpdated,
                sampleCategory: parsed.categories?.[0]?.categoryName || 'none',
                sampleProductCount: parsed.categories?.[0]?.products?.length || 0
              }
            } catch (parseError: any) {
              debugInfo.cacheContent = { parseError: parseError?.message || 'パースエラー' }
            }
          }
        } else if (action === 'test') {
          // テスト保存と読み込み
          const testData = { test: true, time: Date.now() }
          await kv.set('debug-test', JSON.stringify(testData))
          const retrieved = await kv.get('debug-test')
          
          debugInfo.test = {
            saved: testData,
            retrieved: retrieved,
            match: JSON.stringify(testData) === retrieved
          }
        }
        
        debugInfo.kvStatus = 'accessible'
      } catch (kvError: any) {
        debugInfo.kvError = kvError.message
        debugInfo.kvStatus = 'error'
      }
    } else {
      debugInfo.kvStatus = 'not configured'
    }
    
    // メモリキャッシュの確認
    debugInfo.memoryCache = {
      hasGlobalCache: !!(global as any).memoryCache,
      hasTimestamp: !!(global as any).memoryCacheTimestamp
    }
    
    return NextResponse.json({
      success: true,
      debug: debugInfo
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toLocaleString('ja-JP')
    }, { status: 500 })
  }
}