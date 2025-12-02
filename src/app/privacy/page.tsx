import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | MITSUKERU',
  description: '当サイトのプライバシーポリシーについて',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
          
          <div className="prose max-w-none text-gray-700 space-y-6">
            <p className="text-sm text-gray-500">最終更新日: 2025年12月3日</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 基本方針</h2>
              <p>
                MITSUKERU（以下、「当サイト」）は、ご利用者様の個人情報保護の重要性を認識し、個人情報保護法および関連する法令を遵守し、適切な個人情報の管理・保護に努めます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 収集する情報</h2>
              <p>当サイトでは以下の情報を収集する場合があります：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>アクセスログ（IPアドレス、ブラウザ情報、アクセス日時等）</li>
                <li>Cookie及び類似技術によるデータ</li>
                <li>お問い合わせフォームに入力された情報</li>
                <li>プロテイン診断機能で入力されたデータ</li>
                <li>サイトの利用状況に関する分析データ</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 情報の利用目的</h2>
              <p>収集した情報は以下の目的で利用します：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>サイトの運営・改善</li>
                <li>お客様へのサービス提供</li>
                <li>プロテイン診断結果の表示</li>
                <li>アクセス解析・統計分析</li>
                <li>お問い合わせへの対応</li>
                <li>法令に基づく義務の履行</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookieについて</h2>
              <p>
                当サイトでは、サービスの利便性向上のためCookieを使用しています。Cookieは、お客様のブラウザに保存される小さなデータファイルです。
              </p>
              <p>
                Cookieの使用を望まない場合は、ブラウザの設定でCookieを無効にできますが、サイトの一部機能が制限される場合があります。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. アフィリエイトプログラムについて</h2>
              <p>当サイトは以下のアフィリエイトプログラムに参加しています：</p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-lg">楽天アフィリエイト</h3>
                  <p>
                    当サイトは、楽天グループ株式会社が運営する楽天アフィリエイトのアフィリエイトプログラムに参加しています。
                    商品購入の際、楽天により購入履歴等の情報が収集される場合があります。
                  </p>
                  <p className="text-sm text-gray-600">詳細: <a href="https://affiliate.rakuten.co.jp/" className="text-blue-600 underline">楽天アフィリエイト</a></p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-lg">Amazon アソシエイト</h3>
                  <p>
                    当サイトは、Amazon.co.jpアソシエイトプログラムの参加者です。
                    商品購入の際、Amazonにより購入履歴等の情報が収集される場合があります。
                  </p>
                  <p className="text-sm text-gray-600">詳細: <a href="https://affiliate.amazon.co.jp/" className="text-blue-600 underline">Amazon アソシエイト</a></p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-lg">Yahoo!ショッピング</h3>
                  <p>
                    当サイトは、ヤフー株式会社が運営するYahoo!ショッピングのアフィリエイトプログラムに参加しています。
                    商品購入の際、Yahoo!により購入履歴等の情報が収集される場合があります。
                  </p>
                  <p className="text-sm text-gray-600">詳細: <a href="https://shopping.yahoo.co.jp/" className="text-blue-600 underline">Yahoo!ショッピング</a></p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 第三者への情報提供</h2>
              <p>当サイトは、以下の場合を除き、個人情報を第三者に提供することはありません：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>法令に基づく場合</li>
                <li>生命、身体または財産の保護のために必要がある場合</li>
                <li>事前に本人の同意を得た場合</li>
                <li>統計的データなど、個人を特定できない形での提供</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. アクセス解析ツール</h2>
              <p>
                当サイトでは、サービス向上のため、Googleアナリティクス等のアクセス解析ツールを使用する場合があります。
                これらのツールはCookieを使用してデータを収集しますが、個人を特定する情報は含まれません。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. セキュリティ</h2>
              <p>
                当サイトは、個人情報の漏洩、滅失または毀損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. プライバシーポリシーの変更</h2>
              <p>
                当サイトは、必要に応じてこのプライバシーポリシーを変更することがあります。
                変更後のプライバシーポリシーは、当サイトに掲載された時点で効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. お問い合わせ</h2>
              <p>
                本プライバシーポリシーに関するお問い合わせは、当サイトのお問い合わせフォームよりご連絡ください。
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}