import React, { useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";

import { twMerge } from "tailwind-merge";
import ErrorDialog from "./error/ErrorDialog";
import Button from "./CoreUI/Button";

interface ScrollPaginationProps {
  paginationType: "infinite-scroll" | "view-more";
  loadNextPage: () => void;
  refreshHandler: () => void;
  dataLength: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  endMessage: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const ScrollPagination = ({
  paginationType = "infinite-scroll",
  loadNextPage,
  refreshHandler,
  dataLength,
  loading,
  error,
  currentPage,
  totalItems,
  totalPages,
  hasNextPage,
  endMessage,
  children,
  className,
}: ScrollPaginationProps) => {
  const handleScroll = () => {
    const container = document.getElementById("main-container");

    if (!container || loading || currentPage >= totalPages || !hasNextPage) {
      return;
    }

    if (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - container.clientHeight
    ) {
      loadNextPage();
    }
  };

  useEffect(() => {
    const container = document.getElementById("main-container");

    if (container && paginationType === "infinite-scroll") {
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [currentPage, loading, hasNextPage, totalPages]);

  return (
    <div
      className={twMerge(
        "w-full flex flex-col",
        paginationType === "infinite-scroll" && [
          "min-h-screen pb-5 max-md:pb-24",
        ],
        className
      )}
    >
      {error ? (
        <ErrorDialog
          errorMessage={error}
          buttonLabel="Try again"
          buttonOnClick={refreshHandler}
        />
      ) : (
        <>
          {children}
          {dataLength >= totalItems && totalItems > 0 && endMessage}
          {dataLength !== totalItems && hasNextPage && !loading && (
            <Button
              label="Load More"
              onClick={loadNextPage}
              className="mt-2 bg-slate-50 rounded-full text-sm font-hedvig_letters border-slate-300 text-black"
            />
          )}
          {loading && (
            <div className="w-full flex justify-center mb-5 max-md:mt-3">
              <RotatingLines
                visible={true}
                width="75"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScrollPagination;
