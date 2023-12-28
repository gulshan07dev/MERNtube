export default function Avatar({ url, fullName, className = "w-10 h-10" }) {
  return (
    <div
      className={`avatar cursor-pointer rounded-full overflow-hidden
    ${className}`}
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
