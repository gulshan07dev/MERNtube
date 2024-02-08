import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { twMerge } from "tailwind-merge";
import Button from "./CoreUI/Button";
import ErrorDialog from "./error/ErrorDialog";

export interface queryParams {
  page?: number;
  limit?: number;
  query?: string;
  sortBy?: string;
  sortType?: "acc" | "desc";
  userId?: string;
}

interface ScrollPaginationProps<T> {
  fetchData: (queryParams: queryParams) => void;
  queryParams?: queryParams;
  loading: boolean;
  error: string | null;
  data: T[];
  currPage: number;
  totalPages: number;
  totalDocs: number;
  hasNextPage: boolean;
  RenderComponent: React.FC<{ data: T }>;
  SkeletonComponent?: React.FC;
}

const ScrollPagination = <T extends any>({
  fetchData,
  queryParams = {},
  loading,
  error,
  data,
  currPage,
  totalDocs,
  totalPages,
  hasNextPage,
  RenderComponent,
  SkeletonComponent, 
}: ScrollPaginationProps<T>) => {
  const [sortType, setSortType] = useState<"acc" | "desc">("desc");

  const handleScroll = () => {
    const container = document.getElementById("main-container");

    if (currPage >= totalPages || !hasNextPage) {
      return;
    }
    if (
      container &&
      container.scrollTop + container.clientHeight >=
        container.scrollHeight - container.clientHeight
    ) {
      fetchData({ ...queryParams, page: currPage + 1, sortType });
    }
  };

  useEffect(() => {
    fetchData({ ...queryParams, page: 1, sortType });
  }, [sortType]);

  useEffect(() => {
    const container = document.getElementById("main-container");

    if (container) {
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [
    currPage,
    loading,
    hasNextPage,
    totalPages,
    queryParams.limit,
    queryParams.page,
    queryParams.query,
    queryParams.sortBy,
    queryParams.sortType,
    queryParams.userId,
  ]);

  const renderSkeletons = () => {
    const numSkeletons = queryParams?.limit
      ? totalDocs - data.length < queryParams?.limit &&
        totalDocs - data.length !== 0
        ? totalDocs - data.length
        : queryParams?.limit
      : 6;

    return Array.from({ length: numSkeletons }).map((_, idx) =>
      SkeletonComponent ? <SkeletonComponent key={idx} /> : null
    );
  };

  const handleSortTypeChange = (type: "acc" | "desc") => {
    setSortType(type);
  };

  return (
    <div className="w-full min-h-screen flex flex-col pb-5 max-md:pb-24">
      {error ? (
        <ErrorDialog
          errorMessage={error}
          buttonLabel="Try again"
          buttonOnClick={() => fetchData({ ...queryParams, page: 1, sortType })}
        />
      ) : (
        <>
          {/* filter */}
          <div className="w-full bg-white flex pb-3 pt-2 gap-3 sticky top-0 z-[2]">
            {["desc", "acc"].map((type) => (
              <Button
                key={type}
                label={type === "desc" ? "Newest" : "Oldest"}
                isLarge={false}
                onClick={() => handleSortTypeChange(type as "acc" | "desc")}
                className={twMerge(
                  "rounded-lg bg-gray-200 text-sm text-[#0f0f0f] font-roboto border-none",
                  "hover:opacity-100",
                  sortType === type
                    ? ["bg-black text-white"]
                    : ["hover:bg-gray-300"]
                )}
              />
            ))}
          </div>
          <div className="flex flex-grow flex-wrap bg-white items-start gap-y-7 max-lg:justify-center lg:gap-x-5 gap-10">
            {data.map((item, index) => (
              <RenderComponent key={index} data={item} />
            ))}
            {loading && SkeletonComponent && renderSkeletons()}
          </div>
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
