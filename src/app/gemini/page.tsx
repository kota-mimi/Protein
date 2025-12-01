'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Search, Dumbbell, Zap, TrendingUp, Filter, Sparkles, BookOpen, X, ChevronDown, ChevronUp, ArrowUpDown, SlidersHorizontal, Trophy, Coins, Tag } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { AIChatWidget } from '@/components/AIChatWidget';
import { AIDiagnosisModal } from '@/components/AIDiagnosisModal';
import { ProteinGuide } from '@/components/ProteinGuide';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { Button } from '@/components/ui/Button';
import { fetchProducts } from '@/lib/productService';

export default function GeminiPage() {
  console.log('🔥 GeminiPage component rendering');
  console.log('🔧 React useEffect import:', typeof useEffect);
  const [currentView, setCurrentView] = useState<'HOME' | 'GUIDE'>('HOME');
  
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Filtering & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'PRICE_ASC' | 'PRICE_DESC' | 'RATING'>('RATING');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  
  // Real-time search states
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  
  // UI States
  const [activeTabId, setActiveTabId] = useState<string>('POPULAR');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Product data
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // All products from API (160 products)
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [isLoadingAllProducts, setIsLoadingAllProducts] = useState(false);
  
  // フィルタリングされた商品の状態管理
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set page title and favicon
  useEffect(() => {
    document.title = 'MITSUKERU | 最適なプロテインが見つかる';
    
    // Set favicon
    const existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (existingFavicon) {
      existingFavicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23005A9C"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="14" font-weight="bold">M</text></svg>';
    } else {
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23005A9C"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="14" font-weight="bold">M</text></svg>';
      document.head.appendChild(favicon);
    }
  }, []);

  // 初期データはキャッシュから高速読み込み
  useEffect(() => {
    const loadInitialProductsFromCache = async () => {
      try {
        console.log('🚀 キャッシュから初期商品データを高速読み込み開始');
        
        // キャッシュから商品データを取得
        const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3002';
        const cacheResponse = await fetch(`${baseUrl}/api/cached-products`);
        
        if (cacheResponse.ok) {
          const cacheData = await cacheResponse.json();
          
          if (cacheData.success && cacheData.products && cacheData.products.length > 0) {
            // キャッシュから人気商品を選択（最初の50商品）
            const popularProducts = cacheData.products.slice(0, 50);
            setRecommendedProducts(popularProducts);
            setProducts(popularProducts.slice(0, 30)); // 基本表示用
            console.log('✅ キャッシュから初期商品データを高速読み込み完了:', popularProducts.length, '商品');
            return;
          }
        }
        
        // キャッシュが空の場合のフォールバック（静的データ）
        console.log('⚠️ キャッシュが空、フォールバックデータを使用');
        const fallbackProducts = [
          {
            id: 'fb001',
            name: 'エクスプロージョン ホエイプロテイン ミルクチョコレート味 3kg',
            description: '大容量3kgでコスパ最強。筋力トレーニングに最適なプロテイン。',
            image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/x-plosion/cabinet/yec/11362306/241227_10000019.jpg?_ex=500x500',
            category: 'WHEY',
            rating: 4.5,
            reviews: 1988,
            tags: ['大容量', 'コスパ'],
            price: 8399,
            protein: 20.0,
            calories: 110,
            servings: 100,
            shops: [{ name: 'Rakuten' as const, price: 8399, url: 'https://item.rakuten.co.jp/x-plosion/10000019/' }]
          }
        ];
        
        setRecommendedProducts(fallbackProducts);
        setProducts(fallbackProducts);
        
      } catch (error) {
        console.error('❌ 初期データ読み込みエラー:', error);
        // エラー時も空配列で初期化して画面を壊さない
        setRecommendedProducts([]);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialProductsFromCache();
  }, []);



  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleDiagnosisComplete = (recommendedType: string) => {
    setCurrentView('HOME');
    setIsDiagnosisOpen(false);
    
    // 診断結果に基づいて推薦商品を選択（最大10個）
    const filteredProducts = products.filter(product => {
      if (recommendedType === 'WHEY') return product.category === 'WHEY';
      if (recommendedType === 'VEGAN') return product.category === 'VEGAN';
      return true; // ALL の場合
    });
    
    // 10個に制限して推薦商品を設定
    const recommended = filteredProducts.slice(0, 10);
    setRecommendedProducts(recommended);
    setShowRecommendations(true);
    
    setTimeout(() => {
        document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Load all products from cache - キャッシュから取得（1週間に1回更新）
  const loadAllProducts = async () => {
    try {
      console.log('🎯 loadAllProducts実行開始');
      setIsLoadingAllProducts(true);
      
      // SSR/クライアント対応のbaseURL
      const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3002';
      
      console.log('📖 キャッシュデータから商品を読み込み中...');
      const cacheResponse = await fetch(`${baseUrl}/api/cached-products`);
      
      if (cacheResponse.ok) {
        const cacheData = await cacheResponse.json();
        console.log('🔍 キャッシュデータ詳細:', {
          success: cacheData.success,
          productsLength: cacheData.products?.length,
          hasProducts: !!(cacheData.products && cacheData.products.length > 0)
        });
        
        if (cacheData.success && cacheData.products && cacheData.products.length > 0) {
          console.log('🎯 allProductsにセット開始...');
          setAllProducts(cacheData.products);
          setShowAllProducts(true);
          console.log(`✅ キャッシュから商品データを読み込み完了:`, cacheData.products.length, '商品');
          console.log(`📅 最終更新: ${cacheData.lastUpdated}`);
          return;
        }
      }
      
      // キャッシュが空の場合のフォールバック - 最小限のデータ取得＋バックグラウンド更新
      console.log('⚠️ キャッシュデータが見つかりません、最小限のデータ取得＋バックグラウンド更新');
      
      try {
        // バックグラウンドでキャッシュ更新をトリガー（ユーザーを待たせない）
        fetch(`${baseUrl}/api/update-cache`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(() => console.log('🔄 バックグラウンドでキャッシュ更新開始'))
          .catch(err => console.log('⚠️ キャッシュ更新エラー:', err));
          
        // 最小限の楽天APIデータを取得（1回だけ）
        const response = await fetch(`${baseUrl}/api/cached-products`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.products && data.products.length > 0) {
            console.log(`✅ 基本データ取得完了: ${data.products.length}商品`);
            setAllProducts(data.products);
            setShowAllProducts(true);
            return;
          }
        }
      } catch (error) {
        console.error(`❌ 最小限データ取得エラー:`, error);
      }
      
      // 上記が失敗した場合のフォールバック処理（静的データ）
      console.log('⚠️ 全て失敗、静的データにフォールバック');
      // 静的フォールバックデータ
      const fallbackProducts = [
        {
          id: 'fb001',
          name: 'エクスプロージョン ホエイプロテイン ミルクチョコレート味 3kg',
          description: '大容量3kgでコスパ最強。筋力トレーニングに最適なプロテイン。',
          image: 'https://thumbnail.image.rakuten.co.jp/@0_mall/x-plosion/cabinet/yec/11362306/241227_10000019.jpg?_ex=500x500',
          category: 'WHEY',
          rating: 4.5,
          reviews: 1988,
          tags: ['大容量', 'コスパ'],
          price: 8399,
          protein: 20.0,
          calories: 110,
          servings: 100,
          shops: [{ name: 'Rakuten' as const, price: 8399, url: 'https://item.rakuten.co.jp/x-plosion/10000019/' }]
        },
        {
          id: 'fb002', 
          name: 'ザバス ホエイプロテイン100 ココア味 1050g',
          description: '明治の定番プロテイン。初心者にもおすすめの飲みやすいココア味。',
          image: '/placeholder-protein.svg',
          category: 'WHEY',
          rating: 4.2,
          reviews: 1542,
          tags: ['定番', '飲みやすい'],
          price: 4580,
          protein: 20.9,
          calories: 83,
          servings: 50,
          shops: [{ name: 'Amazon' as const, price: 4580, url: '#' }]
        }
      ];
      
      setAllProducts(fallbackProducts);
      setShowAllProducts(true);
      console.log(`✅ フォールバックデータを使用: ${fallbackProducts.length}商品`);
    } catch (error) {
      console.error('❌ 全商品データ取得エラー:', error);
      // エラー時は空配列を設定して画面を壊さない
      setAllProducts([]);
      setShowAllProducts(true);
    } finally {
      setIsLoadingAllProducts(false);
    }
  };

  // プロテイン商品名からタグを抽出
  const extractProteinTags = (productName: string): string[] => {
    const tags = [];
    const name = productName.toLowerCase();
    
    if (name.includes('ザバス') || name.includes('savas')) tags.push('人気ブランド');
    if (name.includes('マイプロテイン') || name.includes('myprotein')) tags.push('海外ブランド');
    if (name.includes('wpi') || name.includes('アイソレート')) tags.push('高品質');
    if (name.includes('3kg') || name.includes('大容量')) tags.push('大容量');
    if (name.includes('1kg') && !name.includes('3kg')) tags.push('標準サイズ');
    
    // 味情報を詳細に抽出
    if (name.includes('チョコ') || name.includes('ココア') || name.includes('chocolate')) tags.push('チョコ味');
    if (name.includes('バニラ') || name.includes('vanilla')) tags.push('バニラ味');
    if (name.includes('ストロベリー') || name.includes('いちご') || name.includes('strawberry')) tags.push('ストロベリー味');
    if (name.includes('バナナ') || name.includes('banana')) tags.push('バナナ味');
    if (name.includes('抹茶') || name.includes('matcha')) tags.push('抹茶味');
    if (name.includes('ミルク') || name.includes('milk')) tags.push('ミルク味');
    if (name.includes('カフェオレ') || name.includes('coffee')) tags.push('コーヒー味');
    if (name.includes('プレーン') || name.includes('無添加') || name.includes('plain')) tags.push('プレーン');
    
    return tags;
  };

  // 楽天APIから商品検索（複数ページ対応）
  const searchRakutenProducts = async (keyword: string, maxPages = 3) => {
    const allProducts = [];
    
    try {
      console.log(`🔍 楽天検索開始: "${keyword}" (最大${maxPages}ページ)`);
      const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3002';
      
      // 複数ページから商品を取得
      for (let page = 1; page <= maxPages; page++) {
        try {
          const response = await fetch(`${baseUrl}/api/rakuten?keyword=${encodeURIComponent(keyword)}&page=${page}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.products && data.products.length > 0) {
              const mappedProducts = data.products.map((product: any) => ({
                ...product,
                categoryName: 'プロテイン商品',
                category: product.category || 'WHEY',
                image: product.imageUrl || '/placeholder-protein.svg',
                rating: product.reviewAverage || 0,
                reviews: product.reviewCount || 0,
                tags: ['楽天', ...extractProteinTags(product.name)].filter(Boolean),
                description: product.description || '',
                // 正しい商品情報をマッピング
                protein: product.features?.protein || 20, // タンパク質量
                calories: product.features?.calories || 110, // カロリー
                servings: product.features?.servings || 30, // 回数
                pricePerServing: product.pricePerServing || Math.round((product.price || 0) / 30), // 1回あたり価格
                shops: [{
                  name: 'Rakuten' as const,
                  price: product.price || 0,
                  url: product.affiliateUrl || product.url || '#' // affiliateUrlまたはurlを使用
                }]
              }));
              
              allProducts.push(...mappedProducts);
              console.log(`📦 ページ${page}: ${data.products.length}商品取得 (累計${allProducts.length}商品)`);
              
              // 少し間隔を空けてAPI制限を回避
              if (page < maxPages) {
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            } else {
              console.log(`⚠️ ページ${page}: データなし、検索終了`);
              break;
            }
          } else {
            console.warn(`⚠️ ページ${page}: API呼び出し失敗 (${response.status})`);
            break;
          }
        } catch (pageError) {
          console.error(`❌ ページ${page}取得エラー:`, pageError);
          break;
        }
      }
      
      console.log(`✅ 楽天検索完了: ${allProducts.length}商品取得`);
      return allProducts;
      
    } catch (error) {
      console.error('楽天検索エラー:', error);
      return [];
    }
  };

  // キャッシュベース検索機能（高速）
  const performCacheBasedSearch = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    try {
      console.log(`🔍 キャッシュベース検索: "${query}"`);
      
      // キャッシュされた全商品から検索
      if (allProducts.length > 0) {
        const filteredProducts = allProducts.filter(product => {
          const searchTerm = query.toLowerCase();
          const matchName = product.name.toLowerCase().includes(searchTerm);
          const matchDescription = (product.description || '').toLowerCase().includes(searchTerm);
          const matchTags = (product.tags || []).some(tag => tag.toLowerCase().includes(searchTerm));
          const matchBrand = (product.brand || '').toLowerCase().includes(searchTerm);
          
          return matchName || matchDescription || matchTags || matchBrand;
        });
        
        // 関連度でソート（名前マッチを優先）
        filteredProducts.sort((a, b) => {
          const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase());
          const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase());
          if (aNameMatch && !bNameMatch) return -1;
          if (!aNameMatch && bNameMatch) return 1;
          return b.rating - a.rating; // 評価順
        });
        
        setSearchResults(filteredProducts);
        console.log(`✅ キャッシュベース検索完了: ${filteredProducts.length}件`);
      } else {
        setSearchResults([]);
        console.log('⚠️ キャッシュデータが空です');
      }
    } catch (error) {
      console.error('キャッシュベース検索エラー:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 検索のデバウンス処理（高速化）
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        performCacheBasedSearch(searchQuery);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300); // 300msに短縮（キャッシュベースなので高速）
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, allProducts]); // eslint-disable-line react-hooks/exhaustive-deps

  // 最初から全商品を読み込み - 強制実行
  useEffect(() => {
    console.log('🚀 強制useEffect実行中!');
    
    const executeLoad = async () => {
      try {
        console.log('🔄 loadAllProducts開始...');
        await loadAllProducts();
        console.log('✅ loadAllProducts完了!');
      } catch (error) {
        console.error('❌ loadAllProductsエラー:', error);
      }
    };
    
    executeLoad();
  }, []); // 空の依存配列で確実に1回だけ実行

  // allProductsが更新された時にフィルタリングを実行
  useEffect(() => {
    console.log('🔄 フィルタリング用useEffect実行: allProducts.length=', allProducts.length);
    if (allProducts.length > 0) {
      console.log('🎯 フィルタリング実行開始 - ソース商品数:', allProducts.length);
      
      // フィルタリングロジック
      const sourceProducts = searchQuery && searchResults.length > 0 ? searchResults : allProducts;
      let displayProducts = sourceProducts.filter(p => {
        // 1. Search Query Filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(query);
          const matchDesc = (p.description || '').toLowerCase().includes(query);
          const matchTags = (p.tags || []).some(t => t.toLowerCase().includes(query));
          const matchBrand = (p.brand || '').toLowerCase().includes(query);
          if (!matchName && !matchDesc && !matchTags && !matchBrand) return false;
        }

        // 2. Category Filter
        if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
          return false;
        }

        // 3. Price Range Filter
        const productPrice = p.price || (p.shops && p.shops.length > 0 ? Math.min(...p.shops.map(s => s.price)) : 0);
        if (minPrice && productPrice < Number(minPrice)) return false;
        if (maxPrice && productPrice > Number(maxPrice)) return false;
        
        return true;
      });

      // Sorting Logic
      displayProducts.sort((a, b) => {
        const minPriceA = a.price || (a.shops && a.shops.length > 0 ? Math.min(...a.shops.map(s => s.price)) : 0);
        const minPriceB = b.price || (b.shops && b.shops.length > 0 ? Math.min(...b.shops.map(s => s.price)) : 0);

        if (sortBy === 'PRICE_ASC') return minPriceA - minPriceB;
        if (sortBy === 'PRICE_DESC') return minPriceB - minPriceA;
        return b.rating - a.rating; // Default RATING
      });

      console.log('✅ フィルタリング完了:', displayProducts.length, '商品');
      setFilteredProducts(displayProducts);
    } else {
      console.log('⚠️ allProductsが空なのでフィルタリングスキップ');
      setFilteredProducts([]);
    }
  }, [allProducts, selectedCategory, searchQuery, searchResults, minPrice, maxPrice, sortBy]);

  const handleQuickFilter = async (id: string, applyFn: () => void | Promise<void>) => {
    setActiveTabId(id);
    try {
      await applyFn();
    } catch (error) {
      console.error('フィルター適用エラー:', error);
    }
  };

  // 新しいフィルタリングシステムを使用
  const displayProducts = filteredProducts;
  console.log(`🎯 表示商品数: ${displayProducts.length}商品`);

  const categories = [
    { id: 'ALL', label: 'すべて' },
    { id: 'WHEY', label: 'ホエイ' },
    { id: 'CASEIN', label: 'カゼイン' },
    { id: 'VEGAN', label: 'ソイ/植物性' },
  ];

  const navigateTo = (view: 'HOME' | 'GUIDE') => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white text-secondary selection:bg-primary selection:text-white font-sans">
      

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 border-b ${isScrolled || currentView === 'GUIDE' ? 'bg-white/95 backdrop-blur-md border-slate-100 py-3 shadow-sm' : 'bg-transparent border-transparent py-6'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer group" onClick={() => navigateTo('HOME')}>
            <span className="text-xl md:text-2xl font-black tracking-widest text-secondary group-hover:text-primary transition-colors">
              MITSUKERU
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide text-slate-600">
            <button onClick={() => { navigateTo('HOME'); setIsDiagnosisOpen(true); }} className="hover:text-primary transition-colors flex items-center">AI診断</button>
            <button onClick={() => navigateTo('GUIDE')} className={`transition-colors flex items-center ${currentView === 'GUIDE' ? 'text-primary' : 'hover:text-secondary'}`}>初心者ガイド</button>
            <button onClick={() => { navigateTo('HOME'); setTimeout(() => document.getElementById('ranking')?.scrollIntoView({behavior:'smooth'}), 100)}} className="hover:text-secondary transition-colors">商品一覧</button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-600 hover:text-secondary transition-colors hidden sm:block" onClick={() => document.getElementById('search-input')?.focus()}>
              <Search className="w-5 h-5" />
            </button>
            <Button 
                variant="primary" 
                size="sm" 
                className="hidden md:flex"
                onClick={() => setIsDiagnosisOpen(true)}
            >
                無料診断スタート
            </Button>
            <button className="md:hidden p-2 text-secondary">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Switching */}
      {currentView === 'GUIDE' ? (
        <ProteinGuide onBack={() => navigateTo('HOME')} />
      ) : (
        <>
          {/* Hero Section */}
          <header className="relative pt-32 pb-20 md:pt-48 md:pb-24 overflow-hidden bg-white">
            {/* Background Effects (Subtle Dodgers Blue) */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 relative z-10 text-center">
              <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 rounded-full px-6 py-2 mb-8 shadow-sm hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => setIsDiagnosisOpen(true)}>
                <span className="text-xs font-bold text-slate-600 tracking-wide group-hover:text-primary transition-colors">30秒で完了！AI診断はこちら</span>
              </div>
              
              <h1 className="font-black tracking-tighter mb-10 text-secondary">
                <span className="block text-3xl md:text-5xl leading-tight">
                  見つける、<span className="text-primary">マイプロテイン</span>。
                </span>
              </h1>
              
              <p className="text-slate-600 text-base md:text-xl max-w-2xl mx-auto mb-12 leading-8 md:leading-9 tracking-wide font-medium">
                あなたの「体質」と「目的」にベストマッチする商品を<span className="text-primary font-bold">AI</span>が分析。<br className="hidden md:block" />
                各ショップの価格をリアルタイム比較し、<span className="text-primary border-b-2 border-primary/30 pb-0.5 mx-1 font-bold">最安値</span>で賢く手に入れよう。
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto shadow-xl shadow-primary/20 hover:shadow-primary/40" onClick={() => setIsDiagnosisOpen(true)}>
                  今すぐ診断する
                </Button>
                <Button size="lg" variant="secondary" className="h-14 px-8 rounded-full w-full sm:w-auto shadow-xl shadow-slate-800/20" onClick={() => navigateTo('GUIDE')}>
                  プロテインの選び方
                </Button>
              </div>
            </div>
          </header>

          {/* AI診断結果の推薦商品セクション */}
          {showRecommendations && (
            <section id="recommendations" className="container mx-auto px-4 py-8 bg-gradient-to-br from-orange-50 to-amber-50 border-b border-slate-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">AI診断結果</span>
                </div>
                <h2 className="text-2xl font-bold text-secondary mb-2">
                  あなたにおすすめのプロテイン
                </h2>
                <p className="text-slate-600">診断結果に基づいて、最適な商品を厳選しました</p>
              </div>
              
              {/* 推薦商品グリッド */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {recommendedProducts.map((product) => (
                  <ProductCard
                    key={product.id} 
                    product={product} 
                    onOpenDetail={handleOpenDetail}
                  />
                ))}
              </div>
              
              {/* 他の商品も見る */}
              <div className="text-center">
                <button 
                  onClick={() => setShowRecommendations(false)}
                  className="text-primary hover:text-primaryDark font-semibold text-sm"
                >
                  他の商品も見る →
                </button>
              </div>
            </section>
          )}

          {/* Main Content Area */}
          <main id="ranking" className="container mx-auto px-4 py-8 bg-white min-h-[600px]">
            
            {/* Page Title */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-slate-800 mb-2">プロテイン商品一覧</h1>
              <p className="text-slate-600">お気に入りのプロテインを見つけよう</p>
            </div>

            {/* Search & Advanced Filter Section */}
            <div className="mb-8">
              <div className="flex flex-col gap-2">
                
                {/* Search Bar + Filter Toggle */}
                <div className="flex gap-2">
                   <div className="relative group flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                      <input 
                        id="search-input"
                        type="text" 
                        placeholder="何でも検索してみて！例: チョコ味、ザバス、WPI、安い..." 
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if (e.target.value) setActiveTabId('CUSTOM');
                        }}
                        className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base transition-shadow hover:shadow-md text-secondary"
                      />
                      {isSearching && (
                        <div className="absolute right-12 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                   </div>
                   <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`px-4 rounded-lg border font-bold flex items-center gap-2 transition-all ${isFilterOpen ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-secondary border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'}`}
                   >
                     <SlidersHorizontal className="w-5 h-5" />
                     <span className="hidden sm:inline">絞り込み</span>
                   </button>
                </div>

                {/* Collapsible Filter Panel */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isFilterOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-lg mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Column 1: Categories */}
                    <div>
                      <button
                        onClick={() => setCategoryExpanded(!categoryExpanded)}
                        className="flex items-center justify-between w-full text-left mb-3"
                      >
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">カテゴリを選択</h3>
                        {categoryExpanded ? 
                          <ChevronUp className="w-4 h-4 text-slate-400" /> : 
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        }
                      </button>
                      {categoryExpanded && (
                        <div className="flex flex-wrap gap-2">
                          {categories.map(cat => (
                            <button
                              key={cat.id}
                              onClick={() => {
                                setSelectedCategory(cat.id);
                              }}
                              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                                selectedCategory === cat.id
                                  ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-1'
                                  : 'bg-slate-100 text-secondary hover:bg-slate-200'
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Column 2: Price Range */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">価格範囲 (円)</h3>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">¥</span>
                          <input 
                            type="number" 
                            placeholder="下限なし" 
                            value={minPrice}
                            onChange={(e) => {
                              setMinPrice(e.target.value);
                              setActiveTabId('CUSTOM');
                            }}
                            className="w-full pl-6 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-secondary"
                          />
                        </div>
                        <span className="text-slate-400">〜</span>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">¥</span>
                          <input 
                            type="number" 
                            placeholder="上限なし" 
                            value={maxPrice}
                            onChange={(e) => {
                              setMaxPrice(e.target.value);
                              setActiveTabId('CUSTOM');
                            }}
                            className="w-full pl-6 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-secondary"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Sort */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">並び替え</h3>
                      <div className="space-y-2">
                        <label className="flex items-center p-2 rounded hover:bg-slate-50 cursor-pointer">
                          <input 
                            type="radio" 
                            name="sort" 
                            checked={sortBy === 'RATING'} 
                            onChange={() => {
                              setSortBy('RATING');
                              setActiveTabId('CUSTOM');
                            }}
                            className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                          />
                          <span className="ml-2 text-sm text-secondary">評価が高い順 (人気)</span>
                        </label>
                        <label className="flex items-center p-2 rounded hover:bg-slate-50 cursor-pointer">
                          <input 
                            type="radio" 
                            name="sort" 
                            checked={sortBy === 'PRICE_ASC'} 
                            onChange={() => {
                              setSortBy('PRICE_ASC');
                              setActiveTabId('CUSTOM');
                            }}
                            className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                          />
                          <span className="ml-2 text-sm text-secondary">価格が安い順</span>
                        </label>
                        <label className="flex items-center p-2 rounded hover:bg-slate-50 cursor-pointer">
                          <input 
                            type="radio" 
                            name="sort" 
                            checked={sortBy === 'PRICE_DESC'} 
                            onChange={() => {
                              setSortBy('PRICE_DESC');
                              setActiveTabId('CUSTOM');
                            }}
                            className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                          />
                          <span className="ml-2 text-sm text-secondary">価格が高い順</span>
                        </label>
                      </div>
                    </div>

                  </div>
                  
                  {/* Active Filter Chips */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCategory !== 'ALL' && (
                      <div className="inline-flex items-center text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
                        カテゴリ: {categories.find(c => c.id === selectedCategory)?.label}
                        <button onClick={() => setSelectedCategory('ALL')} className="ml-1 hover:text-primaryDark"><X className="w-3 h-3"/></button>
                      </div>
                    )}
                    {minPrice && (
                       <div className="inline-flex items-center text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
                        ¥{minPrice}以上
                        <button onClick={() => setMinPrice('')} className="ml-1 hover:text-primaryDark"><X className="w-3 h-3"/></button>
                      </div>
                    )}
                    {maxPrice && (
                       <div className="inline-flex items-center text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
                        ¥{maxPrice}以下
                        <button onClick={() => setMaxPrice('')} className="ml-1 hover:text-primaryDark"><X className="w-3 h-3"/></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid - Compact 2 columns on Mobile, 5 on Large Screens */}
            {isLoading || isLoadingAllProducts ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
                    <div className="aspect-[4/3] bg-slate-200 rounded mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {displayProducts.map((product, index) => {
                  // 商品データの基本的な検証
                  if (!product || !product.id) {
                    console.warn('不正な商品データ:', product);
                    return null;
                  }
                  
                  try {
                    return (
                      <ProductCard 
                        key={`${product.id}-${index}-${product.name?.slice(0, 10) || 'unknown'}`} 
                        product={product} 
                        onOpenDetail={handleOpenDetail}
                      />
                    );
                  } catch (cardError) {
                    console.error('ProductCard描画エラー:', cardError, product);
                    return (
                      <div key={`error-${product.id}-${index}`} className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <p className="text-xs text-red-600">商品データエラー</p>
                      </div>
                    );
                  }
                })}
              </div>
            )}

            {displayProducts.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <div className="inline-flex justify-center items-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                   <Search className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-lg font-bold text-secondary mb-2">条件に一致する商品が見つかりませんでした。</p>
                <p className="text-slate-400 mb-6">検索キーワードを変えるか、フィルターをリセットしてください。</p>
                <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); setMinPrice(''); setMaxPrice(''); setActiveTabId('POPULAR'); }}>すべての商品を表示</Button>
              </div>
            )}

          </main>
        </>
      )}

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 text-sm border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <span className="text-lg font-bold">MITSUKERU</span>
            </div>
            <div className="flex space-x-6 text-slate-300">
              <a href="#" className="hover:text-white transition-colors">運営会社</a>
              <a href="#" className="hover:text-white transition-colors">掲載依頼（メーカー様）</a>
              <a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a>
              <a href="#" className="hover:text-white transition-colors">お問い合わせ</a>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400">
            ※当サイトはアフィリエイトプログラムに参加しています。商品購入により一定の手数料を得る場合があります。<br/>
            &copy; 2024 MITSUKERU Media. All rights reserved.
          </p>
        </div>
      </footer>

      {/* AI Diagnosis Modal */}
      <AIDiagnosisModal 
        isOpen={isDiagnosisOpen}
        onClose={() => setIsDiagnosisOpen(false)}
        onComplete={handleDiagnosisComplete}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal 
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <AIChatWidget />
    </div>
  );
}