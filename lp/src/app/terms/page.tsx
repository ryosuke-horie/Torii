import { Header } from "@/components/Header";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-black">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          利用規約
        </h1>

        <div className="prose dark:prose-invert">
          <h2>1. はじめに</h2>
          <p>
            本利用規約（以下「本規約」といいます）は、当社が提供するToriiサービス（以下「本サービス」といいます）の
            利用条件を定めるものです。
          </p>

          <h2>2. 利用資格</h2>
          <p>本サービスは、以下の条件を満たす方がご利用いただけます：</p>
          <ul>
            <li>格闘技ジムの経営者もしくは従業員であること</li>
            <li>本規約に同意していただけること</li>
            <li>過去に本規約に違反したことがないこと</li>
          </ul>

          <h2>3. 禁止事項</h2>
          <p>本サービスのご利用に際して、以下の行為を禁止いたします：</p>
          <ul>
            <li>法令違反行為</li>
            <li>他のユーザーへの迷惑行為</li>
            <li>システムへの不正アクセス</li>
            <li>その他、当社が不適切と判断する行為</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
