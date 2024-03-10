import { ReactNode, useEffect, useRef, useState } from "react";

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
    setIsOverflowing(isTextOverflowing());
  }, [children, initialShowLine, contentRef]);

  const toggleShow = () => {
    setShowAll(!showAll);
  };

  // Function to check if text exceeds the initial show line
  function isTextOverflowing() {
    if (containerRef.current && contentRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const contentHeight = contentRef.current.scrollHeight;
      return contentHeight > containerHeight;
    }
    return false;
  }

  return (
    <div ref={containerRef}>
      <p
        ref={contentRef}
        className={className}
        style={
          showAll
            ? { overflow: "unset", display: "block" }
            : {
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: initialShowLine,
                WebkitBoxOrient: "vertical",
              }
        }
      >
        {children}
      </p>
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
