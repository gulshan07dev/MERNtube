import { twMerge } from "tailwind-merge";

export default function Avatar({ url, fullName, className = "w-10 h-10" }: {
  url?: string,
  fullName?: string,
  className?: string
}) {
  return (
    <div
      className={twMerge(
        "avatar cursor-pointer rounded-full overflow-hidden",
        className
      )}
      role="button"
    >
      {fullName && !url ? (
        <span
          className="h-full w-full grid place-items-center text-lg
         bg-blue-500 text-white font-roboto"
        >
          {fullName[0].toUpperCase()}
        </span>
      ) : (
        <img src={url || "/default-avatar.webp"} alt="avatar" />
      )}
    </div>
  );
}
