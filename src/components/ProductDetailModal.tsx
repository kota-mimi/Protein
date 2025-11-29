import React from 'react';
import { X, Star, ExternalLink, TrendingUp, Droplets, User } from 'lucide-react';
import { Product } from '@/types';
import { Button } from './ui/Button';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  isOpen, 
  onClose
}) => {
  if (!product || !isOpen) return null;

  const minPrice = Math.min(...product.shops.map(s => s.price));
  
  // タンパク質1gあたりの価格計算
  let pricePerProtein = 0;
  if (product.specs.proteinRatio > 0 && product.specs.weightGrams > 0) {
    const totalProtein = product.specs.weightGrams * (product.specs.proteinRatio / 100);
    pricePerProtein = Math.round((minPrice / totalProtein) * 10) / 10;
  }

  // Flavor Bar Component
  const FlavorBar = ({ label, value }: { label: string, value: number }) => (
    <div className="flex items-center text-xs sm:text-sm mb-2">
      <span className="w-20 text-slate-500 font-bold">{label}</span>
      <div className="flex-1 flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div 
            key={level} 
            className={`h-2 flex-1 rounded-sm ${level <= value ? 'bg-primary' : 'bg-slate-200'}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-secondary/30 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:h-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Image & Key Visuals */}
        <div className="w-full md:w-2/5 bg-slate-100 relative">
           <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-64 md:h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent"></div>
           
           <button 
             onClick={onClose}
             className="absolute top-4 left-4 p-2 bg-white/50 hover:bg-white rounded-full text-slate-800 backdrop-blur md:hidden"
           >
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* Right: Content */}
        <div className="w-full md:w-3/5 flex flex-col overflow-y-auto bg-white">
          <div className="p-6 md:p-8">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                 <div className="flex flex-wrap gap-2 mb-2">
                    {product.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold bg-secondary text-white px-2 py-1 rounded border border-secondary/50 shadow-sm">
                        {tag}
                      </span>
                    ))}
                 </div>
                 <h2 className="text-2xl font-bold text-secondary mb-2 leading-tight">{product.name}</h2>
                 <div className="flex items-center space-x-2 text-sm">
                    <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                    <span className="font-bold text-slate-900">{product.rating}</span>
                    <span className="text-slate-500">({product.reviews}件のレビュー)</span>
                 </div>
              </div>
              <button onClick={onClose} className="hidden md:block p-2 text-slate-400 hover:text-slate-800"><X className="w-6 h-6"/></button>
            </div>

            {/* Price & Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-slate-500 text-xs mb-1">最安値目安</div>
                <div className="text-2xl font-bold text-slate-900 px-2 rounded inline-block font-mono">¥{minPrice.toLocaleString()}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative overflow-hidden">
                {pricePerProtein > 0 && (
                   <div className="absolute top-0 right-0 bg-primary/10 p-1.5 rounded-bl-lg">
                      <TrendingUp className="w-4 h-4 text-primary" />
                   </div>
                )}
                <div className="text-slate-500 text-xs mb-1">タンパク質1g単価</div>
                {pricePerProtein > 0 ? (
                  <div className="text-2xl font-bold text-primary px-2 rounded inline-block font-mono">¥{pricePerProtein}<span className="text-sm text-slate-500 font-normal">/g</span></div>
                ) : (
                  <div className="text-xl font-bold text-slate-400">-</div>
                )}
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Flavor Profile */}
            {product.flavorProfile && (
              <div className="mb-8 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="text-sm font-bold text-secondary mb-4 flex items-center">
                  <Droplets className="w-4 h-4 mr-2 text-primary" />
                  味覚・特徴チャート
                </h3>
                <FlavorBar label="甘さ" value={product.flavorProfile.sweetness} />
                <FlavorBar label="酸味" value={product.flavorProfile.acidity} />
                <FlavorBar label="濃厚さ" value={product.flavorProfile.richness} />
                <FlavorBar label="溶けやすさ" value={product.flavorProfile.solubility} />
              </div>
            )}

            {/* Reviews Snippet */}
            {product.reviewList && product.reviewList.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-secondary mb-4 flex items-center">
                  <User className="w-4 h-4 mr-2 text-primary" />
                  購入者の声
                </h3>
                <div className="space-y-3">
                  {product.reviewList.map(review => (
                    <div key={review.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-700">{review.user}</span>
                        <div className="flex text-orange-400 text-[10px]">
                          {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase Links */}
            <div className="mt-auto pt-4">
              <div className="space-y-2">
                 {product.shops.map((shop) => (
                   <a 
                     key={shop.name}
                     href={shop.url}
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center justify-between w-full p-3 rounded bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200 hover:border-slate-300 group shadow-sm"
                   >
                     <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${shop.name === 'Rakuten' ? 'bg-[#BF0000]' : shop.name === 'Amazon' ? 'bg-[#FF9900]' : 'bg-blue-500'}`} />
                       <span className="font-bold text-slate-700 text-sm">{shop.name === 'Official' ? '公式サイト' : shop.name}で見る</span>
                     </div>
                     <span className="font-mono font-bold text-slate-900 flex items-center group-hover:text-primary transition-colors">
                        ¥{shop.price.toLocaleString()}
                        <ExternalLink className="w-4 h-4 ml-2 text-slate-400 group-hover:text-primary" />
                     </span>
                   </a>
                 ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};