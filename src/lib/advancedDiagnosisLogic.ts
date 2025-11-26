import { AdvancedProtein, DiagnosisAnswers, MatchResult, advancedProteins } from './advancedProteins';

export type { DiagnosisAnswers, MatchResult } from './advancedProteins';

export class AdvancedDiagnosisEngine {
  
  /**
   * 診断結果を計算してマッチング上位3商品を返す
   */
  static diagnose(answers: DiagnosisAnswers): MatchResult[] {
    const results: MatchResult[] = [];
    
    for (const protein of advancedProteins) {
      const score = this.calculateScore(protein, answers);
      const reason = this.generateReason(protein, answers);
      
      results.push({
        protein,
        score,
        reason
      });
    }
    
    // スコア順にソートして上位3つを返す
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }
  
  /**
   * プロテインとユーザー回答のマッチスコアを計算
   */
  private static calculateScore(protein: AdvancedProtein, answers: DiagnosisAnswers): number {
    let score = 0;
    
    // 1. 目的マッチング（最重要 - 最大40点）
    const purposeMatch = answers.purpose.filter(p => protein.purpose.includes(p)).length;
    score += purposeMatch * 20;
    
    // 2. 性別マッチング（15点）
    if (protein.gender.includes(answers.gender)) {
      score += 15;
    }
    
    // 3. 体質マッチング（最大20点）
    // 太りやすい → 低カロリー
    if (answers.bodyType.gainWeight && protein.features.calories < 100) {
      score += 8;
    }
    // 乳糖不耐症 → 乳糖少ない
    if (answers.bodyType.lactoseIntolerant && protein.features.lactose !== 'high') {
      score += 12;
    }
    // 空腹になりやすい → 腹持ちが良い
    if (answers.bodyType.getHungry && protein.features.fullness >= 4) {
      score += 8;
    }
    
    // 4. 運動頻度マッチング（10点）
    const exerciseScore = this.getExerciseScore(answers.exerciseFreq, protein);
    score += exerciseScore;
    
    // 5. タイミングマッチング（10点）
    const timingMatch = answers.timing.filter(t => protein.timing.includes(t)).length;
    score += Math.min(timingMatch * 3, 10);
    
    // 6. 味の好みマッチング（最大15点）
    if (answers.taste.sweet && protein.taste.sweetness >= 4) score += 5;
    if (answers.taste.refreshing && protein.taste.refreshing) score += 5;
    if (answers.taste.fruity && protein.taste.fruity) score += 5;
    if (answers.taste.noArtificial && protein.features.artificial <= 2) score += 8;
    
    // 7. その他の希望マッチング（最大15点）
    if (answers.preferences.domestic && protein.features.domestic) score += 5;
    if (answers.preferences.noArtificial && protein.features.artificial <= 1) score += 5;
    if (answers.preferences.beautyIngredients && protein.features.beauty) score += 5;
    
    // 8. 品質ボーナス（最大10点）
    // 高タンパク質
    if (protein.features.protein >= 24) score += 3;
    // 溶けやすさ
    if (protein.features.solubility >= 4) score += 2;
    // コスパ
    if (protein.pricePerServing <= 50) score += 3;
    // 低糖質
    if (protein.features.sugar <= 2) score += 2;
    
    return Math.round(score);
  }
  
  /**
   * 運動頻度に基づくスコア
   */
  private static getExerciseScore(freq: string, protein: AdvancedProtein): number {
    switch (freq) {
      case 'なし':
        return protein.purpose.includes('健康') ? 8 : 2;
      case '週1':
        return protein.purpose.includes('日常') ? 6 : 3;
      case '週2-3':
        return protein.purpose.includes('筋トレ') ? 8 : 4;
      case '週4-5':
        return protein.purpose.includes('筋トレ') && protein.features.protein >= 20 ? 10 : 5;
      case '毎日':
        return protein.purpose.includes('本格') || protein.purpose.includes('アスリート') ? 10 : 6;
      default:
        return 0;
    }
  }
  
  /**
   * おすすめ理由を生成
   */
  private static generateReason(protein: AdvancedProtein, answers: DiagnosisAnswers): string {
    const reasons: string[] = [];
    
    // 目的マッチング
    const purposeMatches = answers.purpose.filter(p => protein.purpose.includes(p));
    if (purposeMatches.length > 0) {
      reasons.push(`${purposeMatches.join('・')}に最適な設計`);
    }
    
    // 体質配慮
    if (answers.bodyType.lactoseIntolerant && protein.features.lactose !== 'high') {
      reasons.push('乳糖に配慮した処方');
    }
    if (answers.bodyType.gainWeight && protein.features.calories < 100) {
      reasons.push('低カロリーでダイエットをサポート');
    }
    if (answers.bodyType.getHungry && protein.features.fullness >= 4) {
      reasons.push('腹持ちが良く空腹感を抑制');
    }
    
    // 味の特徴
    if (answers.taste.sweet && protein.taste.sweetness >= 4) {
      reasons.push('甘くて美味しい味わい');
    }
    if (answers.taste.refreshing && protein.taste.refreshing) {
      reasons.push('さっぱりとした飲みやすさ');
    }
    if (answers.taste.fruity && protein.taste.fruity) {
      reasons.push('フルーティーで親しみやすい味');
    }
    
    // 品質・特徴
    if (protein.features.protein >= 24) {
      reasons.push('高タンパク質含有');
    }
    if (protein.features.solubility >= 4) {
      reasons.push('溶けやすく飲みやすい');
    }
    if (protein.pricePerServing <= 50) {
      reasons.push('優れたコストパフォーマンス');
    }
    
    // その他の希望
    if (answers.preferences.domestic && protein.features.domestic) {
      reasons.push('安心の国産品質');
    }
    if (answers.preferences.noArtificial && protein.features.artificial <= 1) {
      reasons.push('人工甘味料を極力使用せず自然な味');
    }
    if (answers.preferences.beautyIngredients && protein.features.beauty) {
      reasons.push('美容成分配合で内側からキレイに');
    }
    
    // 性別特化
    if (answers.gender === '女性' && protein.gender.length === 1 && protein.gender[0] === '女性') {
      reasons.push('女性のニーズに特化した配合');
    }
    
    return reasons.slice(0, 3).join('、') + 'が特徴です。';
  }
  
  /**
   * マッチ率をパーセンテージで計算
   */
  static calculateMatchPercentage(score: number): number {
    const maxPossibleScore = 125; // 理論上の最大スコア
    return Math.min(Math.round((score / maxPossibleScore) * 100), 99);
  }
}