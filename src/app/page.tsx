import Link from 'next/link'
import { ArrowRight, CheckCircle2, Search, ShoppingBag } from 'lucide-react'
import { proteins } from '@/lib/proteins'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-[#F8F9FA] overflow-hidden pt-20 pb-28 sm:pt-32 sm:pb-40">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]">
            最適なプロテインが、<br/>
            <span className="text-blue-600">もっと簡単に見つかる。</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            数ある商品の中から、あなたの目的・予算・好みに<br className="hidden sm:block"/>
            ぴったり合うプロテインを瞬時に提案します。
          </p>
          
          {/* Main Actions */}
          <div className="flex justify-center mb-16">
             <Link 
              href="/diagnose" 
              className="group bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-5 px-10 rounded-full shadow-xl shadow-blue-900/10 transition-all transform hover:-translate-y-1 flex items-center gap-3"
            >
              <span>自分に合うプロテインを見つける</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-500 font-medium opacity-80">
            <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-600" />
                <span>会員登録不要</span>
            </div>
            <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-600" />
                <span>完全無料</span>
            </div>
            <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-600" />
                <span>ECサイト直結</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Section */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
             <h2 className="text-2xl font-bold text-gray-900 mb-2">人気のプロテイン</h2>
             <p className="text-sm text-gray-600">多くのユーザーに選ばれているベストセラー</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {proteins.slice(0, 4).map((protein, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-md p-6 relative hover:shadow-lg transition-shadow">
                <div className={`absolute top-3 right-3 ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                } text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 pr-12">
                    {protein.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">ブランド:</span> {protein.brand}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">味:</span> {protein.flavor}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-gray-700">タンパク質</p>
                    <p className="text-lg font-bold text-blue-600">{protein.proteinPerServing}g</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-gray-700">1食価格</p>
                    <p className="text-lg font-bold text-green-600">¥{protein.pricePerServing}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>カロリー: {protein.calories}kcal</p>
                  <p>糖質: {protein.sugarPerServing}g</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">5つの質問で診断</h3>
              <p className="text-sm text-gray-600 leading-relaxed">目的や予算に合わせて、AIがあなたに最適な商品をピックアップします。</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 mx-auto">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">詳細検索・比較</h3>
              <p className="text-sm text-gray-600 leading-relaxed">価格順や成分、フレーバーなど、ECサイトのような感覚で探せます。</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 mx-auto">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">そのまま購入</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Amazonや楽天のリンクから、気になった商品をその場で購入できます。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}