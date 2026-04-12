
type HandProps = {
  children: React.ReactNode;
}

export default function Hand ({ children }: HandProps)  {
  return (
    <div className="
      flex
      items-center
      justify-center
      font-sans
      dark:bg-black
      p-4
      bg-green-800
      rounded-xl
      -space-x-4
      "
    >
      {children}
    </div>
  );
}