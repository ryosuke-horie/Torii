import { Header } from "@/components/Header";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-black">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          プライバシーポリシー
        </h1>

        <div className="prose dark:prose-invert">
          <h2>1. 個人情報の取り扱いについて</h2>
          <p>
            当社は、お客様の個人情報を適切に取り扱い、保護することが社会的責務であると考え、
            以下のプライバシーポリシーを定め、これを遵守することをお約束いたします。
          </p>

          <h2>2. 収集する情報</h2>
          <p>当社が収集する情報には以下が含まれます：</p>
          <ul>
            <li>氏名</li>
            <li>メールアドレス</li>
            <li>電話番号</li>
            <li>所属ジム</li>
            <li>トレーニング記録</li>
          </ul>

          <h2>3. 情報の利用目的</h2>
          <p>収集した情報は、以下の目的で利用いたします：</p>
          <ul>
            <li>サービスの提供および改善</li>
            <li>ユーザーサポート</li>
            <li>サービスに関する重要なお知らせ</li>
            <li>統計データの作成</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
