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
    text: "いつプロテインを飲みたいですか？",
    options: ["朝", "運動後", "夜", "間食代わり"]
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

export const AIDiagnosisModal: React.FC<AIDiagnosisModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [subAnswers, setSubAnswers] = useState<{taste?: string, customTaste?: string, budget?: string, allergyOther?: string}>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showSubQuestions, setShowSubQuestions] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [step]: answer };
    setAnswers(newAnswers);
    
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      analyze(newAnswers);
    }
  };

  const analyze = async (finalAnswers: {[key: number]: string}) => {
    setIsAnalyzing(true);
    
    console.log('🧠 新診断開始', finalAnswers, subAnswers);
    
    // 最適なプロテイン判定ロジック
    let recommendedType = 'WHEY'; // デフォルト
    let reasons = []; // 推薦理由
    
    const purpose = finalAnswers[0];        // 目的
    const exercise = finalAnswers[1];       // 運動頻度  
    const lactoseIssue = finalAnswers[2];   // 牛乳でお腹ゴロゴロ
    const allergy = finalAnswers[3];        // アレルギー
    const skinIssue = finalAnswers[4];      // 肌荒れ・ニキビ
    const proteinIntake = finalAnswers[5];  // 普段のタンパク質摂取
    const snacking = finalAnswers[6];       // 間食
    const timing = finalAnswers[7];         // 飲むタイミング
    const liquid = finalAnswers[8];         // 水or牛乳
    const tastePreference = finalAnswers[9]; // 味の好み
    
    console.log(`📋 詳細回答:`, {purpose, exercise, lactoseIssue, allergy, skinIssue, proteinIntake, snacking, timing, liquid, tastePreference});
    
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
      timing: timing,
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
    setResult(null);
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
                  <span>Question {step + 1} of {QUESTIONS.length}</span>
                  <span>{Math.round(((step) / QUESTIONS.length) * 100)}% 完了</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-secondary mb-8 text-center leading-relaxed">
                {QUESTIONS[step].text}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {QUESTIONS[step].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 font-medium text-left flex items-center justify-between group shadow-sm hover:shadow-md"
                  >
                    {option}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-white" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};