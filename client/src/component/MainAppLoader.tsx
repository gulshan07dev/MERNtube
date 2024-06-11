export default function MainAppLoader() {
  return (
    <section className="w-full h-screen bg-white dark:bg-dark_bg flex justify-center items-center">
      <div className="flex gap-2 items-center animate-in fade-in zoom-in repeat-1">
        <img
          src="/merntube-icon.webp"
          alt="logo"
          className="sm:w-[100px] w-[75px] animate-pulse"
        />
        <div className="flex gap-1 font-nunito_sans text-4xl text-zinc-800 dark:text-white font-semibold">
          <span className="animate-bounce duration-1000 delay-75">M</span>
          <span className="animate-bounce duration-1000 delay-100">e</span>
          <span className="animate-bounce duration-1000 delay-150">r</span>
          <span className="animate-bounce duration-1000 delay-200">n</span>
          <span className="animate-bounce duration-1000 delay-300">t</span>
          <span className="animate-bounce duration-1000 delay-500">u</span>
          <span className="animate-bounce duration-1000 delay-700">b</span>
          <span className="animate-bounce duration-1000 delay-1000">e</span>
        </div>
      </div>
    </section>
  );
}
