'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, ArrowRight, Tag, TrendingUp, Award, DollarSign, Search, X, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react'

interface Product {
  id: string
  name: string
  brand: string
  imageUrl: string
  reviewAverage: number
  reviewCount: number
  description: string
  nutrition: {
    protein: number
    calories: number
    servings: number
    servingSize: number
  }
  type: string
  flavor: string
  price: number
  pricePerServing: number
  shopName: string
  affiliateUrl: string
  category: string
}

interface Category {
  category: string
  categoryName: string
  products: Product[]
}

const categoryIcons = {
  popular: <TrendingUp className="w-5 h-5" />,
  cospa: <DollarSign className="w-5 h-5" />,
  sale: <Tag className="w-5 h-5" />,
  premium: <Star className="w-5 h-5" />
}

const categoryColors = {
  popular: 'bg-gradient-to-r from-emerald-500 to-teal-600',
  cospa: 'bg-gradient-to-r from-amber-500 to-orange-600', 
  sale: 'bg-gradient-to-r from-rose-500 to-pink-600',
  premium: 'bg-gradient-to-r from-violet-500 to-purple-600'
}

const categoryThemes = {
  popular: {
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    text: 'text-emerald-900',
    accent: 'text-emerald-600'
  },
  cospa: {
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    text: 'text-amber-900', 
    accent: 'text-amber-600'
  },
  sale: {
    bg: 'bg-gradient-to-br from-rose-50 to-pink-50',
    text: 'text-rose-900',
    accent: 'text-rose-600'
  },
  premium: {
    bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
    text: 'text-violet-900',
    accent: 'text-violet-600'
  }
}

export default function FeaturedProducts() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating' | 'review'>('default')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // キャッシュを強制的に無効化
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/featured-products?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        const data = await response.json()
        
        if (data.success) {
          setCategories(data.categories)
          setFilteredCategories(data.categories)
        } else {
          setError(data.error)
        }
      } catch (err) {
        console.error('人気商品取得エラー:', err)
        setError('商品情報の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  // 検索・フィルタリング・ソート機能
  useEffect(() => {
    let filtered = categories.map(category => ({
      ...category,
      products: category.products.filter(product => {
        // テキスト検索
        const matchesSearch = !searchTerm.trim() || 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.type.toLowerCase().includes(searchTerm.toLowerCase())
        
        // 価格帯フィルター
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
        
        return matchesSearch && matchesPrice
      })
    })).filter(category => category.products.length > 0)

    // ソート機能
    filtered = filtered.map(category => ({
      ...category,
      products: category.products.sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price
          case 'price-desc':
            return b.price - a.price
          case 'rating':
            return b.reviewAverage - a.reviewAverage
          case 'review':
            return b.reviewCount - a.reviewCount
          default:
            return 0
        }
      })
    }))

    setFilteredCategories(filtered)
  }, [searchTerm, categories, sortBy, priceRange])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">人気商品を読み込み中...</h2>
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-80 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-2">商品情報の取得に失敗</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.03)_25%,rgba(68,68,68,.03)_75%,transparent_75%,transparent)] bg-[length:20px_20px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🔥 人気のプロテイン
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            実際に売れている商品から厳選。複数のECサイトから価格・在庫・レビュー情報を比較できます。
          </p>
          
          {/* Modern Search and Filter Bar */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-xl p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="お気に入りのプロテインを見つけよう..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-200 text-slate-800 placeholder-slate-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Modern Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-slate-50 hover:bg-white border-0 rounded-xl px-6 py-4 pr-10 focus:ring-2 focus:ring-emerald-500 transition-all duration-200 font-medium text-slate-700"
                  >
                    <option value="default">おすすめ順</option>
                    <option value="price-asc">価格: 安い順</option>
                    <option value="price-desc">価格: 高い順</option>
                    <option value="rating">評価順</option>
                    <option value="review">人気順</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>

                {/* Modern Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                    showFilters 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105' 
                      : 'bg-slate-50 hover:bg-white text-slate-700 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  価格フィルター
                </button>
              </div>

              {/* Modern Price Range Filter */}
              {showFilters && (
                <div className="mt-6 p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
                      <span className="text-sm font-semibold text-slate-800">価格帯で絞り込み</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="最小価格"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-28 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                      <div className="w-4 h-px bg-slate-300"></div>
                      <input
                        type="number"
                        placeholder="最大価格"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                        className="w-28 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                      <span className="text-sm text-slate-500 font-medium">円</span>
                    </div>
                    <button
                      onClick={() => setPriceRange([0, 10000])}
                      className="px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      リセット
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {filteredCategories.map((category) => (
            <div key={category.category} className={`relative ${categoryThemes[category.category as keyof typeof categoryThemes].bg} rounded-2xl p-8 mb-8`}>
              {/* Modern Category Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className={`p-4 ${categoryColors[category.category as keyof typeof categoryColors]} rounded-2xl text-white shadow-lg backdrop-blur-sm`}>
                    {categoryIcons[category.category as keyof typeof categoryIcons]}
                  </div>
                  <div>
                    <h3 className={`text-3xl font-bold ${categoryThemes[category.category as keyof typeof categoryThemes].text} mb-2`}>
                      {category.categoryName}
                    </h3>
                    <div className="flex items-center gap-4">
                      <p className={`${categoryThemes[category.category as keyof typeof categoryThemes].accent} font-medium`}>
                        {category.products.length}商品をピックアップ
                      </p>
                      <div className="w-2 h-2 bg-current opacity-30 rounded-full"></div>
                      <span className={`text-sm ${categoryThemes[category.category as keyof typeof categoryThemes].accent} font-medium`}>
                        最新更新
                      </span>
                    </div>
                  </div>
                </div>
                <Link 
                  href="/gemini" 
                  className={`hidden sm:flex items-center gap-3 ${categoryThemes[category.category as keyof typeof categoryThemes].accent} hover:${categoryThemes[category.category as keyof typeof categoryThemes].text} font-semibold px-6 py-3 bg-white/60 backdrop-blur-sm hover:bg-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group`}
                >
                  すべて見る
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Revolutionary Products Grid - MyProtein Inspired */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {category.products.slice(0, 12).map((product, index) => (
                  <div key={product.id} className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                    
                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                      {index < 3 ? (
                        <div className={`px-3 py-1.5 rounded-full text-white font-bold text-xs shadow-lg backdrop-blur-sm ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                          index === 1 ? 'bg-gradient-to-r from-slate-400 to-slate-600' : 
                          'bg-gradient-to-r from-orange-400 to-orange-600'
                        }`}>
                          {index === 0 ? '🥇 BEST' : index === 1 ? '🥈 HOT' : '🥉 NEW'}
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          PICK
                        </div>
                      )}
                    </div>

                    {/* Wishlist Heart */}
                    <div className="absolute top-3 right-3 z-20">
                      <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all">
                        <svg className="w-4 h-4 text-slate-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>

                    {/* Product Image with Gradient Overlay */}
                    <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                      <img
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300&h=300&fit=crop'}
                        alt={product.name}
                        className="w-full h-full object-contain bg-white p-4 group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300&h=300&fit=crop'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Product Info with Modern Layout */}
                    <div className="p-4 space-y-3">
                      {/* Brand Badge & Rating */}
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 ${categoryThemes[category.category as keyof typeof categoryThemes].bg} ${categoryThemes[category.category as keyof typeof categoryThemes].accent} text-xs font-semibold rounded-lg border ${categoryThemes[category.category as keyof typeof categoryThemes].accent.replace('text-', 'border-')}`}>
                          {product.brand.length > 6 ? product.brand.substring(0, 6) + '...' : product.brand}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span className="text-xs font-semibold text-slate-700">{product.reviewAverage}</span>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 group-hover:text-slate-900">
                        {product.name.length > 35 ? product.name.substring(0, 35) + '...' : product.name}
                      </h3>

                      {/* Compact Nutrition Grid */}
                      <div className="grid grid-cols-2 gap-2 py-2">
                        <div className={`${categoryThemes[category.category as keyof typeof categoryThemes].bg} rounded-lg p-2 text-center border border-white/50`}>
                          <div className="text-xs text-slate-600">プロテイン</div>
                          <div className={`font-bold text-sm ${categoryThemes[category.category as keyof typeof categoryThemes].text}`}>{product.nutrition.protein}g</div>
                        </div>
                        <div className={`${categoryThemes[category.category as keyof typeof categoryThemes].bg} rounded-lg p-2 text-center border border-white/50`}>
                          <div className="text-xs text-slate-600">カロリー</div>
                          <div className={`font-bold text-sm ${categoryThemes[category.category as keyof typeof categoryThemes].text}`}>{product.nutrition.calories}</div>
                        </div>
                      </div>

                      {/* Modern Price Display */}
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-slate-900">
                            ¥{product.pricePerServing}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">/食</span>
                        </div>
                        <div className="text-xs text-slate-600">
                          本体価格: ¥{product.price?.toLocaleString() || '0'}
                        </div>
                      </div>

                      {/* Modern CTA Button */}
                      <a
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full ${categoryColors[category.category as keyof typeof categoryColors]} text-white text-center py-3 px-4 rounded-xl font-bold text-xs shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95`}
                      >
                        カートへ追加
                      </a>

                      {/* Quick View Link */}
                      <button className="w-full text-xs text-slate-500 hover:text-slate-700 font-medium py-1 transition-colors">
                        詳細を見る →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Modern View All Button */}
              {category.products.length > 12 && (
                <div className="mt-8 text-center">
                  <Link 
                    href="/gemini"
                    className={`group inline-flex items-center gap-4 ${categoryColors[category.category as keyof typeof categoryColors]} text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm`}
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
                      </svg>
                    </div>
                    全{category.products.length}商品を見る
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Revolutionary Bottom CTA */}
        <div className="text-center mt-20">
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 shadow-2xl">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.02)_25%,rgba(255,255,255,.02)_75%,transparent_75%,transparent)] bg-[length:60px_60px] animate-pulse"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                AI パーソナル診断
              </div>
              
              <h3 className="text-4xl font-bold text-white mb-6 leading-tight">
                あなた専用のプロテインを
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  AIが見つけ出します
                </span>
              </h3>
              
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                体質、目標、好みを分析してあなたにピッタリの商品を提案。
                <br />
                数千種類の中から最適な1つを見つけましょう。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  href="/simple-diagnosis"
                  className="group inline-flex items-center gap-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-5 px-10 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg">🎯</span>
                  </div>
                  <span className="text-lg">無料診断を始める</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
                
                <Link 
                  href="/gemini"
                  className="group inline-flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 hover:border-white/40 font-bold py-5 px-10 rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg">📦</span>
                  </div>
                  <span className="text-lg">全商品を見る</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
              
              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-8 mt-10 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                  <span>100% 無料</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
                  <span>AI分析</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>即時結果</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}