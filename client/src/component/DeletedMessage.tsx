export default function DeletedMessage({ message }: { message: string }) {
  return (
    <p className="p-2 w-full my-1 mx-0.5 bg-slate-50 dark:bg-[#252525] text-black dark:text-white">
      {message}
    </p>
  );
}
