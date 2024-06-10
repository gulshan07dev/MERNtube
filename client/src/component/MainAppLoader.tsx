export default function MainAppLoader() {
  return (
    <section className="w-full h-screen bg-white dark:bg-dark_bg flex justify-center items-center">
      <div className="flex gap-2 items-center animate-pulse">
        <img
          src="/merntube-icon.webp"
          alt="logo"
          className="animate-pulse w-[100px]"
        />
        <p className="animate-bounce font-nunito_sans text-4xl text-zinc-800 dark:text-white font-semibold">
          Merntube
        </p>
      </div>
    </section>
  );
}
