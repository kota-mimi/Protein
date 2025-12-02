'use client';

import React, { useState } from 'react';
import { X, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { generateDiagnosisReport } from '@/lib/geminiService';

interface AIDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (diagnosisData: {type: string, preferences: any}) => void;
}

const QUESTIONS = [
  {
    id: 0,
    text: "目的はどれですか？（最重要）",
    options: ["痩せたい（減量）", "引き締めたい", "筋肉つけたい（増量）", "健康維持", "間食を減らしたい"]
  },
  {
    id: 1,
    text: "運動してますか？",
    options: ["してない", "週1-2回", "週3-4回", "週5回以上"]
  },
  {
    id: 2,
    text: "牛乳でお腹ゴロゴロしやすいですか？",
    options: ["はい（しやすい）", "いいえ（大丈夫）"]
  },
  {
    id: 3,
    text: "アレルギーはありますか？",
    options: ["乳製品アレルギー", "大豆アレルギー", "特にない", "その他"]
  },
  {
    id: 4,
    text: "肌荒れ・ニキビが出やすいタイプですか？",
    options: ["はい（出やすい）", "いいえ（大丈夫）"]
  },
  {
    id: 5,
    text: "普段、肉・魚・卵・豆腐などのタンパク質は十分摂れていますか？",
    options: ["十分摂れている", "普通", "少ない（不足気味）"]
  },
  {
    id: 6,
    text: "間食（お菓子・菓子パン）は多いですか？",
    options: ["多い", "普通", "少ない"]
  },
  {
    id: 7,
    text: "いつプロテインを飲みたいですか？（複数選択可）",
    options: ["朝", "運動後", "夜", "間食代わり"],
    allowMultiple: true
  },
  {
    id: 8,
    text: "水と牛乳、どちらで飲みたいですか？",
    options: ["水で飲みたい", "牛乳で飲みたい", "どっちでも"]
  },
  {
    id: 9,
    text: "味の好みと予算を教えてください",
    options: ["甘めOK", "甘さ控えめ", "できればプレーン"],
    hasSubQuestions: true,
    subQuestions: {
      taste: {
        text: "好きな味は？",
        options: ["チョコ", "カフェオレ", "バナナ", "抹茶", "いちご", "バニラ", "その他"],
        allowOther: true
      },
      budget: {
        text: "月の予算は？",
        options: ["3000円以下", "3000-5000円", "5000-8000円", "8000円以上"]
      }
    }
  }
];

const getTotalQuestionCount = () => {
  let count = QUESTIONS.length;
  QUESTIONS.forEach(q => {
    if (q.hasSubQuestions && q.subQuestions) {
      count += Object.keys(q.subQuestions).length;
    }
  });
  return count;
};

const TOTAL_QUESTIONS = getTotalQuestionCount();

export const AIDiagnosisModal: React.FC<AIDiagnosisModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string | string[]}>({});
  const [subAnswers, setSubAnswers] = useState<{taste?: string, customTaste?: string, budget?: string, allergyOther?: string}>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showSubQuestions, setShowSubQuestions] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [currentSubStep, setCurrentSubStep] = useState<'taste' | 'budget' | null>(null);
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);

  const handleAnswer = (answer: string) => {
    const currentQuestion = QUESTIONS[step];
    
    // 複数選択の場合
    if (currentQuestion.allowMultiple) {
      const currentSelected = selectedMultiple.includes(answer) 
        ? selectedMultiple.filter(item => item !== answer)
        : [...selectedMultiple, answer];
      setSelectedMultiple(currentSelected);
      return; // 複数選択の場合は次に進まない
    }
    
    const newAnswers = { ...answers, [step]: answer };
    setAnswers(newAnswers);
    
    // アレルギーの「その他」選択時
    if (step === 3 && answer === "その他") {
      setShowCustomInput(true);
      return;
    }
    
    // 最後の質問（味の好みと予算）でサブ質問に進む
    if (step === QUESTIONS.length - 1 && QUESTIONS[step].hasSubQuestions) {
      setShowSubQuestions(true);
      setCurrentSubStep('taste');
      return;
    }
    
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      analyze(newAnswers);
    }
  };

  const handleNext = () => {
    const currentQuestion = QUESTIONS[step];
    
    if (currentQuestion.allowMultiple && selectedMultiple.length > 0) {
      const newAnswers = { ...answers, [step]: selectedMultiple };
      setAnswers(newAnswers);
      setSelectedMultiple([]);
      
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        analyze(newAnswers);
      }
    }
  };

  const handleBack = () => {
    if (showSubQuestions) {
      if (currentSubStep === 'budget') {
        setCurrentSubStep('taste');
      } else {
        setShowSubQuestions(false);
        setCurrentSubStep(null);
      }
    } else if (showCustomInput) {
      setShowCustomInput(false);
      setCustomInput("");
    } else if (step > 0) {
      setStep(step - 1);
      // 前の質問が複数選択の場合、選択状態を復元
      const prevQuestion = QUESTIONS[step - 1];
      if (prevQuestion.allowMultiple && answers[step - 1]) {
        setSelectedMultiple(Array.isArray(answers[step - 1]) ? answers[step - 1] as string[] : []);
      }
    }
  };

  const handleSubAnswer = (subQuestionType: 'taste' | 'budget', answer: string) => {
    if (subQuestionType === 'taste') {
      if (answer === "その他") {
        setShowCustomInput(true);
        setSubAnswers(prev => ({...prev, taste: answer}));
        return;
      }
      setSubAnswers(prev => ({...prev, taste: answer}));
      setCurrentSubStep('budget');
    } else if (subQuestionType === 'budget') {
      setSubAnswers(prev => ({...prev, budget: answer}));
      // 全ての質問完了、分析開始
      analyze(answers);
    }
  };

  const handleCustomInput = (inputType: 'allergy' | 'taste') => {
    if (inputType === 'allergy') {
      setSubAnswers(prev => ({...prev, allergyOther: customInput}));
      setShowCustomInput(false);
      setCustomInput("");
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        analyze(answers);
      }
    } else if (inputType === 'taste') {
      setSubAnswers(prev => ({...prev, customTaste: customInput}));
      setShowCustomInput(false);
      setCustomInput("");
      setCurrentSubStep('budget');
    }
  };

  const analyze = async (finalAnswers: {[key: number]: string | string[]}) => {
    setIsAnalyzing(true);
    
    console.log('🧠 新診断開始', finalAnswers, subAnswers);
    
    // 最適なプロテイン判定ロジック
    let recommendedType = 'WHEY'; // デフォルト
    let reasons = []; // 推薦理由
    
    const purpose = finalAnswers[0] as string;        // 目的
    const exercise = finalAnswers[1] as string;       // 運動頻度  
    const lactoseIssue = finalAnswers[2] as string;   // 牛乳でお腹ゴロゴロ
    const allergy = finalAnswers[3] as string;        // アレルギー
    const skinIssue = finalAnswers[4] as string;      // 肌荒れ・ニキビ
    const proteinIntake = finalAnswers[5] as string;  // 普段のタンパク質摂取
    const snacking = finalAnswers[6] as string;       // 間食
    const timing = finalAnswers[7] as string | string[]; // 飲むタイミング（複数選択可）
    const liquid = finalAnswers[8] as string;         // 水or牛乳
    const tastePreference = finalAnswers[9] as string; // 味の好み
    
    // タイミングを文字列形式に変換（複数選択対応）
    const timingString = Array.isArray(timing) ? timing.join('、') : timing;
    
    console.log(`📋 詳細回答:`, {purpose, exercise, lactoseIssue, allergy, skinIssue, proteinIntake, snacking, timing: timingString, liquid, tastePreference});
    
    // 1. アレルギー・体質で強制決定（最優先）
    if (allergy.includes("乳製品")) {
      recommendedType = 'VEGAN';
      reasons.push("乳製品アレルギーのため、ソイプロテインを推奨");
      console.log('🚨 乳製品アレルギー → VEGAN');
    } else if (allergy.includes("大豆")) {
      recommendedType = 'WHEY';
      reasons.push("大豆アレルギーのため、ホエイプロテインを推奨");
      console.log('🚨 大豆アレルギー → WHEY');
    } else if (lactoseIssue.includes("はい")) {
      recommendedType = 'VEGAN';
      reasons.push("乳糖不耐症の可能性があるため、消化に優しいソイプロテインを推奨");
      console.log('🚨 乳糖不耐症 → VEGAN');
    } else {
      // 2. 目的による判定
      if (purpose.includes("痩せたい") || purpose.includes("引き締め")) {
        recommendedType = 'VEGAN';
        reasons.push("ダイエット・引き締めに効果的なソイプロテインを推奨");
        console.log('🎯 ダイエット目的 → VEGAN');
      } else if (purpose.includes("筋肉つけたい")) {
        recommendedType = 'WHEY';
        reasons.push("筋肉増量に最適な吸収の早いホエイプロテインを推奨");
        console.log('🎯 筋肥大目的 → WHEY');
      } else if (purpose.includes("間食を減らしたい")) {
        recommendedType = 'CASEIN';
        reasons.push("満腹感が持続するカゼインプロテインで間食を抑制");
        console.log('🎯 間食抑制 → CASEIN');
      } else if (purpose.includes("健康維持")) {
        recommendedType = 'WHEY';
        reasons.push("健康維持に最適なバランスの良いホエイプロテインを推奨");
        console.log('🎯 健康維持 → WHEY');
      }
      
      // 3. 運動頻度での微調整
      if (exercise.includes("週5回以上") && purpose.includes("筋肉")) {
        recommendedType = 'WHEY';
        reasons.push("高頻度トレーニングには即効性のホエイが最適");
        console.log('⚡ 高頻度運動 → WHEY強化');
      }
      
      // 4. 肌荒れ考慮
      if (skinIssue.includes("はい")) {
        if (recommendedType === 'WHEY') {
          recommendedType = 'VEGAN';
          reasons.push("肌荒れしやすい体質のため、添加物の少ないソイプロテインに変更");
          console.log('🌿 肌荒れ対策 → VEGAN');
        }
      }
    }
    
    // 5. 詳細な好み情報をまとめ
    const preferences = {
      proteinType: recommendedType,
      reasons: reasons,
      timing: timingString, // 複数選択対応済み
      liquid: liquid,
      budget: subAnswers.budget || "未設定",
      tastePreference: tastePreference,
      favoriteFlavorCategory: subAnswers.taste || "未設定",
      customFlavor: subAnswers.customTaste || "",
      allergyOther: subAnswers.allergyOther || "",
      exerciseLevel: exercise,
      primaryGoal: purpose,
      proteinDeficiency: proteinIntake.includes("少ない")
    };
    
    console.log(`💡 最終診断結果: ${recommendedType}`, preferences);
    
    // 短い遅延後に完了処理
    setTimeout(() => {
      setIsAnalyzing(false);
      onComplete({ type: recommendedType, preferences });
    }, 1500);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setSubAnswers({});
    setResult(null);
    setShowSubQuestions(false);
    setShowCustomInput(false);
    setCustomInput("");
    setCurrentSubStep(null);
    setSelectedMultiple([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-800/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary w-5 h-5 animate-pulse" />
            <h2 className="text-xl font-bold text-secondary tracking-wide">AI プロテイン診断</h2>
          </div>
          <button onClick={reset} className="text-slate-400 hover:text-slate-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-white">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-6 text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary mb-2">AIが分析中...</h3>
                <p className="text-slate-500">あなたのライフスタイルに最適な配合を計算しています</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase tracking-wider font-bold">
                  <span>Question {step + 1} of {TOTAL_QUESTIONS}</span>
                  <span>{Math.round(((step + (showSubQuestions ? (currentSubStep === 'budget' ? 2 : 1) : 0)) / TOTAL_QUESTIONS) * 100)}% 完了</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${((step + 1 + (showSubQuestions ? (currentSubStep === 'budget' ? 2 : 1) : 0)) / TOTAL_QUESTIONS) * 100}%` }}
                  ></div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-secondary mb-8 text-center leading-relaxed">
                {QUESTIONS[step].text}
              </h3>

              {/* カスタム入力フィールド表示 */}
              {showCustomInput && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                      {step === 3 ? "アレルギーの詳細を入力してください" : "好きな味を入力してください"}
                    </label>
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder={step === 3 ? "例: 小麦、卵など" : "例: ココア、ストロベリーなど"}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCustomInput(step === 3 ? 'allergy' : 'taste')}
                      disabled={!customInput.trim()}
                      className="flex-1 bg-primary text-white py-3 px-6 rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                    >
                      次へ
                    </button>
                    <button
                      onClick={handleBack}
                      className="px-6 py-3 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      戻る
                    </button>
                  </div>
                </div>
              )}

              {/* サブ質問表示 */}
              {showSubQuestions && !showCustomInput && QUESTIONS[step]?.subQuestions && (
                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-secondary text-center">
                    {currentSubStep === 'taste' ? QUESTIONS[step].subQuestions?.taste?.text : QUESTIONS[step].subQuestions?.budget?.text}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(currentSubStep === 'taste' ? QUESTIONS[step].subQuestions?.taste?.options : QUESTIONS[step].subQuestions?.budget?.options)?.map((option: string) => (
                      <button
                        key={option}
                        onClick={() => handleSubAnswer(currentSubStep!, option)}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 font-medium text-left flex items-center justify-between group shadow-sm hover:shadow-md"
                      >
                        {option}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-white" />
                      </button>
                    )) || []}
                  </div>
                  <div className="flex justify-start mt-6">
                    <button
                      onClick={handleBack}
                      className="px-6 py-3 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      戻る
                    </button>
                  </div>
                </div>
              )}

              {/* 通常の質問表示 */}
              {!showSubQuestions && !showCustomInput && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {QUESTIONS[step].options.map((option) => {
                      const isSelected = QUESTIONS[step].allowMultiple 
                        ? selectedMultiple.includes(option)
                        : false;
                      
                      return (
                        <button
                          key={option}
                          onClick={() => handleAnswer(option)}
                          className={`p-4 rounded-xl border text-left flex items-center justify-between group shadow-sm hover:shadow-md transition-all duration-200 font-medium ${
                            isSelected 
                              ? 'border-primary bg-primary text-white' 
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-primary hover:text-white hover:border-primary'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {QUESTIONS[step].allowMultiple && (
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                isSelected ? 'border-white bg-white' : 'border-slate-400'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-primary" />}
                              </div>
                            )}
                            {option}
                          </span>
                          {!QUESTIONS[step].allowMultiple && (
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* 複数選択の場合の次へボタンと戻るボタン */}
                  {QUESTIONS[step].allowMultiple && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleBack}
                        disabled={step === 0}
                        className="px-6 py-3 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        戻る
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={selectedMultiple.length === 0}
                        className="flex-1 bg-primary text-white py-3 px-6 rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                      >
                        次へ ({selectedMultiple.length}個選択中)
                      </button>
                    </div>
                  )}
                  
                  {/* 単一選択の場合の戻るボタン */}
                  {!QUESTIONS[step].allowMultiple && step > 0 && (
                    <div className="flex justify-start mt-6">
                      <button
                        onClick={handleBack}
                        className="px-6 py-3 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        戻る
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};