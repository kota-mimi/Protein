import React from 'react';

interface AdBannerProps {
  position: 'header-below' | 'sidebar' | 'inline' | 'between-products' | 'footer-above';
  size?: 'small' | 'medium' | 'large' | 'responsive';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ position, size = 'responsive', className = '' }) => {
  
  // 位置別の広告サイズとスタイル
  const getAdConfig = () => {
    switch (position) {
      case 'header-below':
        return {
          width: '100%',
          height: '90px',
          bgColor: 'bg-gradient-to-r from-blue-500 to-purple-600',
          text: 'マイプロテイン 特別セール開催中！',
          subtext: '初回購入40%OFF + 送料無料',
          mobile: 'h-20'
        };
      case 'sidebar':
        return {
          width: '300px',
          height: '250px',
          bgColor: 'bg-gradient-to-b from-green-400 to-blue-500',
          text: 'iHerb プロテイン',
          subtext: 'クーポンコード: NEW20',
          mobile: 'hidden md:block'
        };
      case 'inline':
        return {
          width: '100%',
          height: '120px',
          bgColor: 'bg-gradient-to-r from-orange-400 to-red-500',
          text: 'DNS プロテイン 新商品',
          subtext: '限定フレーバー登場！',
          mobile: 'h-24'
        };
      case 'between-products':
        return {
          width: '100%',
          height: '100px',
          bgColor: 'bg-gradient-to-r from-purple-400 to-pink-500',
          text: 'Amazonで人気のプロテイン',
          subtext: 'プライム配送対応',
          mobile: 'h-20'
        };
      case 'footer-above':
        return {
          width: '100%',
          height: '80px',
          bgColor: 'bg-gradient-to-r from-indigo-500 to-blue-600',
          text: 'プロテイン診断をもう一度！',
          subtext: '新しい商品が追加されました',
          mobile: 'h-16'
        };
      default:
        return {
          width: '100%',
          height: '100px',
          bgColor: 'bg-gray-200',
          text: '広告スペース',
          subtext: '',
          mobile: 'h-20'
        };
    }
  };

  const config = getAdConfig();

  return (
    <div 
      className={`
        ${config.bgColor} 
        ${config.mobile}
        relative overflow-hidden rounded-lg shadow-lg cursor-pointer
        hover:shadow-xl transition-all duration-300 hover:scale-[1.02]
        ${className}
      `}
      style={{ 
        width: config.width,
        height: config.height 
      }}
    >
      {/* 背景パターン */}
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      <div className="absolute top-2 right-2 w-16 h-16 bg-white bg-opacity-20 rounded-full blur-xl"></div>
      <div className="absolute bottom-2 left-2 w-12 h-12 bg-white bg-opacity-15 rounded-full blur-lg"></div>
      
      {/* コンテンツ */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h3 className="font-bold text-sm md:text-lg mb-1 drop-shadow-lg">
            {config.text}
          </h3>
          {config.subtext && (
            <p className="text-xs md:text-sm opacity-90 drop-shadow">
              {config.subtext}
            </p>
          )}
          
          {/* CTA ボタン */}
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium backdrop-blur-sm border border-white border-opacity-30">
              詳細を見る →
            </span>
          </div>
        </div>
      </div>
      
      {/* 角の広告ラベル */}
      <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-bl transform rotate-0">
        AD
      </div>
    </div>
  );
};

export default AdBanner;