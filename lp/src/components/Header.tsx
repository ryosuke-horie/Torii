import Link from "next/link";

export function Header() {
  return (
    <header className="fixed w-full top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xs z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-red-800 dark:text-red-500"
            >
              Torii
            </Link>
          </div>
          <nav className="flex gap-6 text-sm text-gray-600 dark:text-gray-300">
            <Link
              href="/privacy-policy"
              className="hover:text-red-800 dark:hover:text-red-500 transition-colors"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/terms"
              className="hover:text-red-800 dark:hover:text-red-500 transition-colors"
            >
              利用規約
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
