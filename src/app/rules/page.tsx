import Link from "next/link";

export default function Rule() {

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      ルール説明のページ      
        <Link href="/">
          トップに戻る
        </Link>
    </div>
  );
}