// 高度な診断用プロテインデータ

export interface AdvancedProtein {
  name: string;
  brand: string;
  type: string[];
  purpose: string[];
  gender: string[];
  flavor: string;
  features: {
    protein: number;        // タンパク質含有量(g)
    sugar: number;         // 糖質(g)
    calories: number;      // カロリー(kcal)
    fullness: number;      // 腹持ち度(1-5)
    absorption: 'fast' | 'medium' | 'slow';
    solubility: number;    // 溶けやすさ(1-5)
    artificial: number;    // 人工甘味料度(1-5, 5=多い)
    lactose: 'high' | 'low' | 'none';  // 乳糖含有
    beauty: boolean;       // 美容成分含有
    domestic: boolean;     // 国産
  };
  taste: {
    sweetness: number;     // 甘さ(1-5)
    refreshing: boolean;   // さっぱり系
    fruity: boolean;       // フルーツ系
    natural: boolean;      // 自然な味
  };
  timing: string[];        // 最適摂取タイミング
  pricePerServing: number;
  description: string;
  links: {
    amazon: string;
    rakuten: string;
  };
}

export const advancedProteins: AdvancedProtein[] = [
  {
    name: "ザバス ホエイプロテイン100 ココア味",
    brand: "SAVAS",
    type: ["ホエイ", "WPC"],
    purpose: ["筋トレ", "日常", "健康"],
    gender: ["男性", "女性"],
    flavor: "ココア",
    features: {
      protein: 20,
      sugar: 2.7,
      calories: 113,
      fullness: 3,
      absorption: 'fast',
      solubility: 4,
      artificial: 3,
      lactose: 'high',
      beauty: false,
      domestic: true
    },
    taste: {
      sweetness: 4,
      refreshing: false,
      fruity: false,
      natural: true
    },
    timing: ["朝", "運動後", "間食"],
    pricePerServing: 68,
    description: "国産の定番ホエイプロテイン。溶けやすく、ココア味で飲みやすい。",
    links: {
      amazon: "https://amazon.co.jp/savas-whey-cocoa",
      rakuten: "https://rakuten.co.jp/savas-whey-cocoa"
    }
  },
  {
    name: "ビーレジェンド ホエイプロテイン 南国パイン風味",
    brand: "beLEGEND",
    type: ["ホエイ", "WPC"],
    purpose: ["筋トレ", "美容", "日常"],
    gender: ["男性", "女性"],
    flavor: "パイン",
    features: {
      protein: 21,
      sugar: 3.0,
      calories: 118,
      fullness: 3,
      absorption: 'fast',
      solubility: 5,
      artificial: 2,
      lactose: 'high',
      beauty: false,
      domestic: true
    },
    taste: {
      sweetness: 4,
      refreshing: true,
      fruity: true,
      natural: false
    },
    timing: ["朝", "運動後", "間食"],
    pricePerServing: 60,
    description: "フルーティーで飲みやすい。コスパが良く、溶けやすさも抜群。",
    links: {
      amazon: "https://amazon.co.jp/belegend-pineapple",
      rakuten: "https://rakuten.co.jp/belegend-pineapple"
    }
  },
  {
    name: "マイプロテイン インパクトホエイ チョコレート",
    brand: "Myprotein",
    type: ["ホエイ", "WPC"],
    purpose: ["筋トレ", "ダイエット"],
    gender: ["男性", "女性"],
    flavor: "チョコレート",
    features: {
      protein: 21,
      sugar: 1.9,
      calories: 103,
      fullness: 2,
      absorption: 'fast',
      solubility: 3,
      artificial: 4,
      lactose: 'high',
      beauty: false,
      domestic: false
    },
    taste: {
      sweetness: 5,
      refreshing: false,
      fruity: false,
      natural: false
    },
    timing: ["朝", "運動後"],
    pricePerServing: 45,
    description: "海外ブランドの高コスパプロテイン。甘いチョコレート味。",
    links: {
      amazon: "https://amazon.co.jp/myprotein-chocolate",
      rakuten: "https://rakuten.co.jp/myprotein-chocolate"
    }
  },
  {
    name: "ザバス ソイプロテイン100 ココア味",
    brand: "SAVAS",
    type: ["ソイ", "植物性"],
    purpose: ["ダイエット", "美容", "健康"],
    gender: ["女性"],
    flavor: "ココア",
    features: {
      protein: 15,
      sugar: 1.1,
      calories: 79,
      fullness: 4,
      absorption: 'slow',
      solubility: 3,
      artificial: 2,
      lactose: 'none',
      beauty: true,
      domestic: true
    },
    taste: {
      sweetness: 3,
      refreshing: false,
      fruity: false,
      natural: true
    },
    timing: ["朝", "夜", "間食", "食事置き換え"],
    pricePerServing: 60,
    description: "大豆由来で乳糖フリー。腹持ちが良く、美容成分配合で女性におすすめ。",
    links: {
      amazon: "https://amazon.co.jp/savas-soy-cocoa",
      rakuten: "https://rakuten.co.jp/savas-soy-cocoa"
    }
  },
  {
    name: "ウェリナ ソイプロテイン 抹茶ラテ味",
    brand: "WELINA",
    type: ["ソイ", "植物性"],
    purpose: ["美容", "ダイエット", "健康"],
    gender: ["女性"],
    flavor: "抹茶",
    features: {
      protein: 16,
      sugar: 0.8,
      calories: 78,
      fullness: 5,
      absorption: 'slow',
      solubility: 4,
      artificial: 1,
      lactose: 'none',
      beauty: true,
      domestic: true
    },
    taste: {
      sweetness: 2,
      refreshing: true,
      fruity: false,
      natural: true
    },
    timing: ["朝", "夜", "食事置き換え"],
    pricePerServing: 85,
    description: "女性専用設計。美容成分豊富で人工甘味料不使用。抹茶の上品な味わい。",
    links: {
      amazon: "https://amazon.co.jp/welina-soy-matcha",
      rakuten: "https://rakuten.co.jp/welina-soy-matcha"
    }
  },
  {
    name: "GOLD'S GYM CFMホエイプロテイン チョコレート",
    brand: "Gold's Gym",
    type: ["ホエイ", "WPI"],
    purpose: ["筋トレ", "本格"],
    gender: ["男性", "女性"],
    flavor: "チョコレート",
    features: {
      protein: 24,
      sugar: 1.2,
      calories: 108,
      fullness: 2,
      absorption: 'fast',
      solubility: 5,
      artificial: 3,
      lactose: 'low',
      beauty: false,
      domestic: true
    },
    taste: {
      sweetness: 3,
      refreshing: false,
      fruity: false,
      natural: true
    },
    timing: ["運動後", "朝"],
    pricePerServing: 110,
    description: "高品質WPI使用。乳糖を除去済みで、本格的な筋トレユーザー向け。",
    links: {
      amazon: "https://amazon.co.jp/golds-gym-cfm",
      rakuten: "https://rakuten.co.jp/golds-gym-cfm"
    }
  },
  {
    name: "X-PLOSION ホエイプロテイン バナナ",
    brand: "X-PLOSION",
    type: ["ホエイ", "WPC"],
    purpose: ["筋トレ", "コスパ"],
    gender: ["男性", "女性"],
    flavor: "バナナ",
    features: {
      protein: 22,
      sugar: 2.0,
      calories: 110,
      fullness: 3,
      absorption: 'fast',
      solubility: 4,
      artificial: 3,
      lactose: 'high',
      beauty: false,
      domestic: true
    },
    taste: {
      sweetness: 4,
      refreshing: false,
      fruity: true,
      natural: false
    },
    timing: ["朝", "運動後", "間食"],
    pricePerServing: 39,
    description: "圧倒的なコストパフォーマンス。バナナ味で飲みやすく、学生にもおすすめ。",
    links: {
      amazon: "https://amazon.co.jp/xplosion-banana",
      rakuten: "https://rakuten.co.jp/xplosion-banana"
    }
  },
  {
    name: "DNS プロテインホエイ100 プレミアムチョコレート",
    brand: "DNS",
    type: ["ホエイ", "WPC"],
    purpose: ["筋トレ", "本格", "アスリート"],
    gender: ["男性", "女性"],
    flavor: "チョコレート",
    features: {
      protein: 25,
      sugar: 2.1,
      calories: 118,
      fullness: 2,
      absorption: 'fast',
      solubility: 5,
      artificial: 2,
      lactose: 'high',
      beauty: false,
      domestic: true
    },
    taste: {
      sweetness: 4,
      refreshing: false,
      fruity: false,
      natural: true
    },
    timing: ["運動後", "朝"],
    pricePerServing: 95,
    description: "アスリート御用達。高たんぱく質で本格的なトレーニング効果をサポート。",
    links: {
      amazon: "https://amazon.co.jp/dns-premium-chocolate",
      rakuten: "https://rakuten.co.jp/dns-premium-chocolate"
    }
  }
];

// 診断結果の型定義
export interface DiagnosisAnswers {
  purpose: string[];
  gender: string;
  bodyType: {
    gainWeight: boolean;
    lactoseIntolerant: boolean;
    getHungry: boolean;
  };
  exerciseFreq: string;
  timing: string[];
  taste: {
    sweet: boolean;
    refreshing: boolean;
    fruity: boolean;
    noArtificial: boolean;
    tasteImportant: boolean;
  };
  preferences: {
    domestic: boolean;
    noArtificial: boolean;
    beautyIngredients: boolean;
  };
}

export interface MatchResult {
  protein: AdvancedProtein;
  score: number;
  reason: string;
}