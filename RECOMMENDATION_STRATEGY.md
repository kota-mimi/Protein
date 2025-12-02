# 本当に良いプロテイン推薦システム設計

## 現在のシステムの問題点
1. **表面的すぎる**: 単純な if-else分岐
2. **個人差を無視**: 体重、年齢、アレルギーを考慮しない
3. **価格感度無視**: 予算に応じた推薦ができない
4. **継続性軽視**: 味の好みを真剣に考慮していない

## 改善案：スコアリングシステム

### 1. 各商品にスコアを付ける仕組み
```typescript
interface ProductScore {
  proteinId: string;
  scores: {
    effectiveness: number;    // 目的への効果 (0-100)
    affordability: number;   // 価格適正性 (0-100) 
    palatability: number;    // 味の適合度 (0-100)
    digestibility: number;   // 消化のしやすさ (0-100)
    convenience: number;     // 使いやすさ (0-100)
  };
  totalScore: number;        // 総合スコア
  reasoning: string[];       // 推薦理由
}
```

### 2. ユーザープロファイル詳細化
```typescript
interface UserProfile {
  // 基本情報
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height?: number;
  
  // 目標
  primaryGoal: 'muscle_gain' | 'weight_loss' | 'maintenance' | 'performance';
  targetWeight?: number;
  timeline: 'short' | 'medium' | 'long'; // 3ヶ月未満/3-6ヶ月/6ヶ月以上
  
  // ライフスタイル
  workoutFrequency: number; // 週何回
  workoutType: 'strength' | 'cardio' | 'mixed';
  workoutTiming: 'morning' | 'afternoon' | 'evening';
  
  // 制約・好み
  budget: number; // 月額予算
  allergies: string[]; // アレルギー
  tastePreferences: string[]; // 味の好み
  brandPreferences?: string[]; // ブランド好み
  
  // 過去の経験
  previousExperience: {
    hasUsedProtein: boolean;
    failureReasons?: string[]; // 過去の失敗理由
    preferredBrands?: string[];
  };
  
  // 重要度（合計100%）
  priorities: {
    effectiveness: number;  // 効果重視度
    price: number;         // 価格重視度  
    taste: number;         // 味重視度
    convenience: number;   // 便利さ重視度
  };
}
```

### 3. 科学的根拠に基づくマッチング
```typescript
// 体重1kgあたりの必要タンパク質量
const PROTEIN_NEEDS = {
  sedentary: 0.8,      // 運動しない人
  light: 1.2,          // 軽い運動
  moderate: 1.6,       // 中程度の運動
  intense: 2.0,        // 激しい運動
  athlete: 2.5         // アスリートレベル
};

// 目標別推奨プロテイン種類
const GOAL_PROTEIN_MAP = {
  muscle_gain: ['WHEY', 'CASEIN'], // 筋肥大：吸収速度の違うものを組み合わせ
  weight_loss: ['VEGAN', 'WHEY'],  // 減量：満腹感+低カロリー
  maintenance: ['WHEY', 'VEGAN'],  // 維持：バランス良く
  performance: ['WHEY']            // パフォーマンス：即効性重視
};
```

### 4. 動的スコアリングアルゴリズム
```typescript
function calculateProductScore(product: Product, user: UserProfile): ProductScore {
  const scores = {
    effectiveness: calculateEffectivenessScore(product, user),
    affordability: calculateAffordabilityScore(product, user), 
    palatability: calculatePalatabilityScore(product, user),
    digestibility: calculateDigestibilityScore(product, user),
    convenience: calculateConvenienceScore(product, user)
  };
  
  // ユーザーの重要度に応じて重み付け
  const totalScore = (
    scores.effectiveness * user.priorities.effectiveness +
    scores.affordability * user.priorities.price +
    scores.palatability * user.priorities.taste +
    scores.convenience * user.priorities.convenience
  ) / 100;
  
  return {
    proteinId: product.id,
    scores,
    totalScore,
    reasoning: generateRecommendationReasons(product, user, scores)
  };
}
```

### 5. 推薦理由の明確化
```typescript
// ユーザーが「なぜこれが推薦されたのか」を理解できる
const reasoningExamples = [
  "あなたの体重(65kg)と週4回の筋トレから、1日約100gのタンパク質が必要です",
  "予算5000円/月の範囲で、最もコスパが良い選択肢です", 
  "過去にお腹を壊した経験から、消化しやすいWPIタイプを選択しました",
  "チョコ味好きの評価で、実際に美味しいと評判の商品です"
];
```

## 実装優先度

### Phase 1: 基本情報の充実
- 体重・予算・アレルギーの質問追加
- 価格帯別フィルタリング強化

### Phase 2: スコアリングシステム導入  
- 各商品への多面的スコア付け
- ユーザー重要度に応じた重み付け

### Phase 3: 学習機能
- ユーザーのクリック・購入データ収集
- 推薦精度の継続的改善

### Phase 4: 高度化
- A/Bテスト機能
- リアルタイム価格連動
- 在庫状況反映

## 期待効果
- **推薦精度向上**: 70%→90%の満足度
- **継続率向上**: 味とライフスタイルマッチング
- **コンバージョン向上**: 明確な推薦理由でユーザー納得感アップ