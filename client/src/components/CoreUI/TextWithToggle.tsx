import { ReactNode, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

const TextWithToggle = ({
  children,
  initialShowLine,
  className,
}: {
  children: ReactNode;
  initialShowLine: number;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [showAll, setShowAll] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (container && content) {
      const lineHeight = parseFloat(
        window.getComputedStyle(content).lineHeight
      );
      const maxHeight = lineHeight * initialShowLine + 1.5;
      const contentHeight = content.scrollHeight;
      const containerWidth = container.clientWidth;
      const contentWidth = content.scrollWidth;

      // Check for both vertical and horizontal overflow
      if (contentHeight > maxHeight) {
        setIsOverflowing(true);
      } else if (contentWidth > containerWidth) {
        setIsOverflowing(true);
      } else {
        setIsOverflowing(false);
      }
    }
  }, [children, initialShowLine, showAll]);

  const toggleShow = () => {
    setShowAll(!showAll);
  };

  return (
    <div ref={containerRef} className={twMerge("w-full", className)}>
      <span
        ref={contentRef}
        className={"w-fit whitespace-break-spaces"}
        style={
          showAll
            ? { overflow: "unset", display: "block", wordBreak: "break-word" }
            : {
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: initialShowLine,
                WebkitBoxOrient: "vertical",
                wordBreak: "break-word",
              }
        }
      >
        {children}
      </span>
      {isOverflowing && !showAll && (
        <button
          onClick={toggleShow}
          className="text-zinc-600 dark:text-slate-400"
        >
          View more
        </button>
      )}
      {showAll && (
        <button
          onClick={toggleShow}
          className="text-zinc-600 dark:text-slate-400"
        >
          View less
        </button>
      )}
    </div>
  );
};

export default TextWithToggle;
