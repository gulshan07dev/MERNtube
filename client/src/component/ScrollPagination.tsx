import React, { useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";
import ErrorDialog from "./error/ErrorDialog";

export interface queryParams {
  page?: number;
  limit?: number;
  query?: string;
  sortBy?: string;
  sortType?: "acc" | "desc";
  userId?: string;
}

interface ScrollPaginationProps {
  next: () => void;
  refreshHandler: () => void;
  dataLength: number;
  loading: boolean;
  error: string | null;
  currPage: number;
  totalPages: number;
  totalDocs: number;
  hasNextPage: boolean;
  endMessage: React.ReactElement;
  children?: React.ReactNode;
}

const ScrollPagination = ({
  next,
  refreshHandler,
  dataLength,
  loading,
  error,
  currPage,
  totalDocs,
  totalPages,
  hasNextPage,
  endMessage,
  children,
}: ScrollPaginationProps) => {
  const handleScroll = () => {
    const container = document.getElementById("main-container");

    if(loading) {
      return
    }
    
    if (currPage >= totalPages || !hasNextPage) {
      return;
    }
    if (
      container &&
      container.scrollTop + container.clientHeight >=
        container.scrollHeight - container.clientHeight
    ) {
      next();
    }
  };

  useEffect(() => {
    const container = document.getElementById("main-container");

    if (container) {
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [currPage, loading, hasNextPage, totalPages]);

  return (
    <div className="w-full min-h-screen flex flex-col pb-5 max-md:pb-24">
      {error ? (
        <ErrorDialog
          errorMessage={error}
          buttonLabel="Try again"
          buttonOnClick={refreshHandler}
        />
      ) : (
        <>
          {children}
          {dataLength === totalDocs && totalDocs && endMessage}
          {loading && (
            <div className="w-full flex justify-center mb-5 max-md:mt-3">
              <RotatingLines
                visible={true}
                width="96"
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
