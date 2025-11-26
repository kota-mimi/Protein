'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Check, Star, Target } from 'lucide-react'
import { DiagnosisAnswers, AdvancedDiagnosisEngine } from '@/lib/advancedDiagnosisLogic'
import AdvancedResultPage from '@/components/AdvancedResultPage'

const questions = [
  {
    id: 'purpose',
    title: 'プロテインを飲む目的は？',
    subtitle: '当てはまるものを全て選択してください',
    type: 'multiple',
    options: [
      { value: '筋トレ', label: '筋力アップ・筋トレ', icon: '💪' },
      { value: 'ダイエット', label: 'ダイエット・体重管理', icon: '⚖️' },
      { value: '健康', label: '健康維持・栄養補給', icon: '🌿' },
      { value: '美容', label: '美容・アンチエイジング', icon: '✨' },
      { value: '食事置き換え', label: '食事代わり・置き換え', icon: '🍽️' }
    ]
  },
  {
    id: 'gender',
    title: '性別を教えてください',
    subtitle: '',
    type: 'single',
    options: [
      { value: '男性', label: '男性', icon: '👨' },
      { value: '女性', label: '女性', icon: '👩' }
    ]
  },
  {
    id: 'bodyType',
    title: '体質について教えてください',
    subtitle: '当てはまるものを全て選択してください',
    type: 'multiple',
    options: [
      { value: 'gainWeight', label: '太りやすい・体重が気になる', icon: '⚠️' },
      { value: 'lactoseIntolerant', label: '牛乳でお腹を壊しやすい', icon: '🥛' },
      { value: 'getHungry', label: 'すぐお腹が空いてしまう', icon: '😋' }
    ]
  },
  {
    id: 'exerciseFreq',
    title: '運動頻度はどのくらいですか？',
    subtitle: '',
    type: 'single',
    options: [
      { value: 'なし', label: '運動はほとんどしない', icon: '🛋️' },
      { value: '週1', label: '週1回程度', icon: '🚶' },
      { value: '週2-3', label: '週2-3回', icon: '🏃' },
      { value: '週4-5', label: '週4-5回', icon: '🏋️' },
      { value: '毎日', label: 'ほぼ毎日', icon: '💪' }
    ]
  },
  {
    id: 'timing',
    title: 'いつ飲む予定ですか？',
    subtitle: '当てはまるものを全て選択してください',
    type: 'multiple',
    options: [
      { value: '朝', label: '朝（朝食時）', icon: '🌅' },
      { value: '運動後', label: '運動・トレーニング後', icon: '🏃‍♂️' },
      { value: '夜', label: '夜（就寝前）', icon: '🌙' },
      { value: '間食', label: '間食・小腹が空いた時', icon: '🍪' },
      { value: '食事置き換え', label: '食事の置き換えとして', icon: '🍽️' }
    ]
  },
  {
    id: 'taste',
    title: '味の好みを教えてください',
    subtitle: '当てはまるものを全て選択してください',
    type: 'multiple',
    options: [
      { value: 'sweet', label: '甘い味が好き', icon: '🍯' },
      { value: 'refreshing', label: 'さっぱりした味が好き', icon: '💧' },
      { value: 'fruity', label: 'フルーツ系の味が好き', icon: '🍓' },
      { value: 'noArtificial', label: '人工的な甘みが苦手', icon: '🚫' },
      { value: 'tasteImportant', label: 'とにかく美味しさ重視', icon: '😋' }
    ]
  },
  {
    id: 'preferences',
    title: 'その他のご希望があれば教えてください',
    subtitle: '任意回答：当てはまるものがあれば選択',
    type: 'multiple',
    options: [
      { value: 'domestic', label: '国産のものが良い', icon: '🗾' },
      { value: 'noArtificial', label: '人工甘味料は避けたい', icon: '🌱' },
      { value: 'beautyIngredients', label: '美容成分が入っていると嬉しい', icon: '💎' }
    ]
  }
]

export default function AdvancedDiagnosisPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    purpose: [],
    gender: '',
    bodyType: {
      gainWeight: false,
      lactoseIntolerant: false,
      getHungry: false
    },
    exerciseFreq: '',
    timing: [],
    taste: {
      sweet: false,
      refreshing: false,
      fruity: false,
      noArtificial: false,
      tasteImportant: false
    },
    preferences: {
      domestic: false,
      noArtificial: false,
      beautyIngredients: false
    }
  })
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<any>(null)

  const currentQuestion = questions[currentStep]
  const isLastStep = currentStep === questions.length - 1
  const progress = ((currentStep + 1) / questions.length) * 100

  const handleAnswer = (questionId: string, value: string, isMultiple: boolean) => {
    setAnswers(prev => {
      const newAnswers = { ...prev }
      
      if (questionId === 'purpose') {
        if (isMultiple) {
          const currentValues = newAnswers.purpose
          if (currentValues.includes(value)) {
            newAnswers.purpose = currentValues.filter(v => v !== value)
          } else {
            newAnswers.purpose = [...currentValues, value]
          }
        }
      } else if (questionId === 'gender') {
        newAnswers.gender = value
      } else if (questionId === 'bodyType') {
        if (isMultiple) {
          newAnswers.bodyType = {
            ...newAnswers.bodyType,
            [value]: !newAnswers.bodyType[value as keyof typeof newAnswers.bodyType]
          }
        }
      } else if (questionId === 'exerciseFreq') {
        newAnswers.exerciseFreq = value
      } else if (questionId === 'timing') {
        if (isMultiple) {
          const currentValues = newAnswers.timing
          if (currentValues.includes(value)) {
            newAnswers.timing = currentValues.filter(v => v !== value)
          } else {
            newAnswers.timing = [...currentValues, value]
          }
        }
      } else if (questionId === 'taste') {
        if (isMultiple) {
          newAnswers.taste = {
            ...newAnswers.taste,
            [value]: !newAnswers.taste[value as keyof typeof newAnswers.taste]
          }
        }
      } else if (questionId === 'preferences') {
        if (isMultiple) {
          newAnswers.preferences = {
            ...newAnswers.preferences,
            [value]: !newAnswers.preferences[value as keyof typeof newAnswers.preferences]
          }
        }
      }
      
      return newAnswers
    })
  }

  const isStepComplete = () => {
    const questionId = currentQuestion.id
    
    if (questionId === 'purpose') return answers.purpose.length > 0
    if (questionId === 'gender') return answers.gender !== ''
    if (questionId === 'bodyType') return true // 任意
    if (questionId === 'exerciseFreq') return answers.exerciseFreq !== ''
    if (questionId === 'timing') return answers.timing.length > 0
    if (questionId === 'taste') return true // 任意
    if (questionId === 'preferences') return true // 任意
    
    return false
  }

  const handleNext = () => {
    if (isLastStep) {
      // 診断実行
      const diagnosisResults = AdvancedDiagnosisEngine.diagnose(answers)
      setResults(diagnosisResults)
      setShowResults(true)
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const isAnswerSelected = (questionId: string, value: string) => {
    if (questionId === 'purpose') return answers.purpose.includes(value)
    if (questionId === 'gender') return answers.gender === value
    if (questionId === 'bodyType') return answers.bodyType[value as keyof typeof answers.bodyType]
    if (questionId === 'exerciseFreq') return answers.exerciseFreq === value
    if (questionId === 'timing') return answers.timing.includes(value)
    if (questionId === 'taste') return answers.taste[value as keyof typeof answers.taste]
    if (questionId === 'preferences') return answers.preferences[value as keyof typeof answers.preferences]
    return false
  }

  if (showResults && results) {
    return <AdvancedResultPage results={results} onRestart={() => {
      setCurrentStep(0)
      setShowResults(false)
      setAnswers({
        purpose: [],
        gender: '',
        bodyType: {
          gainWeight: false,
          lactoseIntolerant: false,
          getHungry: false
        },
        exerciseFreq: '',
        timing: [],
        taste: {
          sweet: false,
          refreshing: false,
          fruity: false,
          noArtificial: false,
          tasteImportant: false
        },
        preferences: {
          domestic: false,
          noArtificial: false,
          beautyIngredients: false
        }
      })
    }} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI プロテイン診断</h1>
          </div>
          <p className="text-gray-600">あなたにぴったりのプロテインを見つけましょう</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">質問 {currentStep + 1} / {questions.length}</span>
            <span className="text-sm font-semibold text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentQuestion.title}
            </h2>
            {currentQuestion.subtitle && (
              <p className="text-gray-600">{currentQuestion.subtitle}</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQuestion.id, option.value, currentQuestion.type === 'multiple')}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-3 hover:shadow-md ${
                  isAnswerSelected(currentQuestion.id, option.value)
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200'
                }`}
              >
                <span className="text-2xl">{option.icon}</span>
                <span className="flex-1 font-medium">{option.label}</span>
                {isAnswerSelected(currentQuestion.id, option.value) && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            戻る
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepComplete() && currentQuestion.id !== 'bodyType' && currentQuestion.id !== 'taste' && currentQuestion.id !== 'preferences'}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              isStepComplete() || currentQuestion.id === 'bodyType' || currentQuestion.id === 'taste' || currentQuestion.id === 'preferences'
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLastStep ? (
              <>
                <Star className="w-5 h-5" />
                診断結果を見る
              </>
            ) : (
              <>
                次へ
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}