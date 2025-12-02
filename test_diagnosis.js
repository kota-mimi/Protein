// Test diagnosis flow simulation
const testDiagnosisData = {
  type: 'VEGAN',
  preferences: {
    purpose: '痩せたい（減量）',
    exercise: '週1-2回', 
    lactoseIssue: 'いいえ（大丈夫）',
    allergy: '特にない',
    skinIssue: 'いいえ',
    proteinIntake: '少ない',
    snacking: 'よくする',
    timing: ['運動後', '間食代わり'],
    liquid: '水',
    tastePreference: '甘めOK',
    budget: '3000-5000円',
    favoriteFlavorCategory: 'チョコ',
    customFlavor: '',
    reasons: ['ダイエット・引き締めに効果的なソイプロテインを推奨']
  }
};

console.log('Testing diagnosis data:', testDiagnosisData);