import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MITSUKERU | 最適なプロテインが見つかる',
  description: 'あなたの「体質」と「目的」にベストマッチする商品をAIが分析。各ショップの価格をリアルタイム比較し、最安値で賢く手に入れよう。',
  keywords: 'プロテイン,MITSUKERU,AI診断,楽天,価格比較,ホエイプロテイン,ソイプロテイン,筋トレ,ダイエット,栄養,サプリメント',
  authors: [{ name: 'MITSUKERU' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'MITSUKERU | 最適なプロテインが見つかる',
    description: 'あなたの「体質」と「目的」にベストマッチする商品をAIが分析。各ショップの価格をリアルタイム比較し、最安値で賢く手に入れよう。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'MITSUKERU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MITSUKERU | 最適なプロテインが見つかる',
    description: 'あなたの「体質」と「目的」にベストマッチする商品をAIが分析。各ショップの価格をリアルタイム比較し、最安値で賢く手に入れよう。',
  },
  alternates: {
    canonical: 'https://protein-ai-diagnosis.vercel.app',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} min-h-screen bg-white font-sans text-gray-900`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "MITSUKERU",
              "description": "あなたの体質と目的にベストマッチする商品をAIが分析",
              "url": "https://protein-ai-diagnosis.vercel.app",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "JPY"
              },
              "featureList": [
                "AIプロテイン診断",
                "楽天商品価格比較",
                "最安値検索",
                "個人の目的に合わせた提案"
              ]
            })
          }}
        />
        <GoogleAnalytics trackingId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
        {children}
      </body>
    </html>
  )
}