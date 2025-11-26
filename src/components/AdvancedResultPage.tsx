import React from 'react'
import { Star, Award, ShoppingBag, RefreshCw, ExternalLink, TrendingUp } from 'lucide-react'
import { MatchResult } from '@/lib/advancedProteins'
import { AdvancedDiagnosisEngine } from '@/lib/advancedDiagnosisLogic'

interface AdvancedResultPageProps {
  results: MatchResult[]
  onRestart: () => void
}

const AdvancedResultPage: React.FC<AdvancedResultPageProps> = ({ results, onRestart }) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return { icon: '🥇', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
      case 1: return { icon: '🥈', color: 'text-gray-600', bgColor: 'bg-gray-50' }
      case 2: return { icon: '🥉', color: 'text-amber-600', bgColor: 'bg-amber-50' }
      default: return { icon: '🏆', color: 'text-blue-600', bgColor: 'bg-blue-50' }
    }
  }

  const getRankLabel = (index: number) => {
    switch (index) {
      case 0: return '最もおすすめ'
      case 1: return '2番目におすすめ'
      case 2: return '3番目におすすめ'
      default: return 'おすすめ'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">診断結果</h1>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-lg text-blue-900 font-medium mb-2">
              あなたにぴったりのプロテインが見つかりました！
            </p>
            <p className="text-blue-700">
              以下の3つの商品が、あなたの条件に最適です。
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-8 mb-12">
          {results.map((result, index) => {
            const rank = getRankIcon(index)
            const matchPercentage = AdvancedDiagnosisEngine.calculateMatchPercentage(result.score)
            
            return (
              <div 
                key={result.protein.name} 
                className={`bg-white rounded-2xl shadow-xl overflow-hidden ${
                  index === 0 ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                {/* Rank Header */}
                <div className={`${rank.bgColor} px-6 py-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{rank.icon}</span>
                      <div>
                        <h3 className={`text-lg font-bold ${rank.color}`}>
                          {getRankLabel(index)}
                        </h3>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-600">
                            マッチ率 {matchPercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ¥{result.protein.pricePerServing}
                      </div>
                      <div className="text-sm text-gray-600">1食あたり</div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Product Info */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {result.protein.name}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {result.protein.brand}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {result.protein.type.join('・')}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {result.protein.flavor}味
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {result.protein.description}
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.protein.features.protein}g
                      </div>
                      <div className="text-sm text-blue-700">タンパク質</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {result.protein.features.calories}
                      </div>
                      <div className="text-sm text-green-700">kcal</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {result.protein.features.sugar}g
                      </div>
                      <div className="text-sm text-yellow-700">糖質</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {'★'.repeat(result.protein.features.solubility)}
                      </div>
                      <div className="text-sm text-purple-700">溶けやすさ</div>
                    </div>
                  </div>

                  {/* Recommendation Reason */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      おすすめの理由
                    </h4>
                    <p className="text-blue-800">{result.reason}</p>
                  </div>

                  {/* Purchase Links */}
                  <div className="flex gap-3">
                    <a
                      href={result.protein.links.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Amazonで購入
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                      href={result.protein.links.rakuten}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      楽天で購入
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Actions */}
        <div className="text-center space-y-4">
          <button
            onClick={onRestart}
            className="bg-white text-blue-600 border-2 border-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            もう一度診断する
          </button>
          
          <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="font-bold text-gray-900 mb-2">診断結果について</h3>
            <p className="text-sm text-gray-600">
              この診断は、あなたの回答に基づいてAIが最適なプロテインを選択したものです。
              実際の購入前には、成分や味についてもご確認ください。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedResultPage