import Link from "next/link";


export default function SettingLayout({ children }) {
  return (
    <main>
      <Link
       href="/"
       className="absolute top-10 left-10 bg-primary px-6 py-3 text-gray-700 rounded-full cursor-pointer hover:bg-secondary-foreground">
       Home
      </Link>

      {children}
    
    </main>
  );
}
