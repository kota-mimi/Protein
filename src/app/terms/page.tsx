import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '利用規約 | MITSUKERU',
  description: '当サイトの利用規約について',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>
          
          <div className="prose max-w-none text-gray-700 space-y-6">
            <p className="text-sm text-gray-500">最終更新日: 2025年12月3日</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第1条（適用）</h2>
              <p>
                この利用規約（以下、「本規約」）は、MITSUKERU（以下、「当サイト」）が提供するプロテイン・サプリメント情報提供サービス（以下、「本サービス」）の利用条件を定めるものです。
                利用者の皆さま（以下、「利用者」）には、本規約に従って本サービスをご利用いただきます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第2条（利用登録）</h2>
              <p>
                本サービスの利用に際して、特別な登録は不要です。
                ただし、プロテイン診断機能等の一部機能を利用する際には、必要な情報の入力をお願いする場合があります。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第3条（禁止事項）</h2>
              <p>利用者は、本サービスの利用にあたり、以下の行為をしてはなりません：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当サイトのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                <li>当サイトのサービスの運営を妨害するおそれのある行為</li>
                <li>他の利用者に関する個人情報等を収集または蓄積する行為</li>
                <li>不正アクセスや、それに関連する行為</li>
                <li>当サイトの知的財産権を侵害する行為</li>
                <li>当サイトを誹謗中傷する行為</li>
                <li>反社会的勢力に対する利益供与その他の協力行為</li>
                <li>その他、当サイトが不適切と判断する行為</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第4条（本サービスの提供の停止等）</h2>
              <p>当サイトは、以下のいずれかの事由があると判断した場合、利用者に事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                <li>その他、当サイトが本サービスの提供が困難と判断した場合</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第5条（著作権）</h2>
              <p>
                当サイトに掲載されているコンテンツ（文章、画像、動画、音声、ソフトウェア、プログラム、コード等）の著作権・肖像権等の知的財産権は、当サイトまたはコンテンツ提供者に帰属します。
                利用者は、当サイトの事前の許可なく、これらのコンテンツを複製、転載、改変、配布等することはできません。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第6条（免責事項）</h2>
              <div className="space-y-4">
                <p>当サイトは、以下について一切の責任を負いません：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>本サービスの内容、精度、完全性、有用性について</li>
                  <li>本サービスが利用者の特定の目的に適合すること</li>
                  <li>本サービスの利用により利用者に生じた損害について</li>
                  <li>外部リンク先で生じた利用者の損害について</li>
                  <li>アフィリエイト提携先における商品購入等で生じた問題について</li>
                  <li>プロテイン診断結果の内容や効果について</li>
                </ul>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="font-semibold text-yellow-800">重要な注意事項</p>
                  <p className="text-yellow-700">
                    当サイトで提供される情報は一般的な情報提供を目的としており、医学的助言や治療の代替となるものではありません。
                    健康に関する問題がある場合は、必ず医師または専門家にご相談ください。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第7条（アフィリエイトについて）</h2>
              <div className="space-y-4">
                <p>
                  当サイトは、楽天アフィリエイト、Amazon アソシエイト、Yahoo!ショッピングなどのアフィリエイトプログラムに参加しています。
                  これらのプログラムにより、商品購入時に当サイトが報酬を受け取る場合があります。
                </p>
                <p>
                  ただし、アフィリエイト報酬の有無が商品の評価や推奨に影響することはありません。
                  当サイトは、利用者の利益を最優先に、客観的な情報提供に努めています。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第8条（利用規約の変更）</h2>
              <p>
                当サイトは、必要と判断した場合には、利用者に通知することなく本規約を変更することができるものとします。
                変更後の利用規約は、当サイトに掲載された時点から効力を生じるものとします。
                利用者が変更後に本サービスを利用した場合、変更後の利用規約に同意したものとみなします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第9条（個人情報の取扱い）</h2>
              <p>
                当サイトは、利用者の個人情報を当サイトの「プライバシーポリシー」に従い適切に取り扱います。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第10条（準拠法・裁判管轄）</h2>
              <p>
                本規約の解釈にあたっては、日本法を準拠法とします。
                本サービスに関して紛争が生じた場合には、当サイト所在地を管轄する裁判所を専属的合意管轄とします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">第11条（お問い合わせ）</h2>
              <p>
                本規約に関するお問い合わせは、当サイトのお問い合わせフォームよりご連絡ください。
              </p>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-center text-sm text-gray-500">
                以上
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}