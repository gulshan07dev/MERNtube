import { twMerge } from "tailwind-merge";

export default function Avatar({
  url,
  fullName,
  onClick = () => {},
  className = "w-10 h-10",
}: {
  url?: string;
  fullName?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "rounded-full overflow-hidden",
        "text-lg bg-blue-500 text-white font-roboto",
        className
      )}
      role="button"
      onClick={onClick}
    >
      {fullName && !url ? (
        <span className="h-full w-full grid place-items-center text-inherit">
          {fullName[0].toUpperCase()}
        </span>
      ) : (
        <img src={url || "/default-avatar.webp"} alt="avatar" className="h-full w-full" />
      )}
    </div>
  );
}
