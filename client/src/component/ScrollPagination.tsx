import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

import { twMerge } from "tailwind-merge";
import ErrorMessage from "./ErrorMessage";
import Button from "./CoreUI/Button";

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
  containerRef: React.RefObject<HTMLElement>;
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
  containerRef,
}: ScrollPaginationProps<T>) => {
  const [sortType, setSortType] = useState<"acc" | "desc">("desc");

  const handleScroll = () => {
    const container = containerRef.current;
    console.log(container?.scrollTop);
    console.log(container);
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
    const container = containerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [
    currPage,
    data,
    loading,
    hasNextPage,
    totalPages,
    sortType,
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

  return (
    <div className="bg-white flex flex-col pb-5 max-md:pb-24 lg:pl-8 max-lg:px-5">
      {error ? (
        <div className="p-4 rounded-md m-auto w-[95%] max-w-[550px] flex flex-col gap-7">
          <ErrorMessage errorMessage={error} />
          <Button
            label="Try again"
            onClick={() => fetchData({ ...queryParams, page: 1, sortType })}
            className="bg-[#ff0c71]"
          />
        </div>
      ) : (
        <>
          {/* filter */}
          <div className="w-full bg-white flex pb-3 pt-2 gap-3 sticky top-0 z-[2]">
            {["desc", "acc"].map((type) => (
              <Button
                key={type}
                label={type === "desc" ? "Newest" : "Oldest"}
                isLarge={false}
                onClick={() => setSortType(type as "acc" | "desc")}
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
          <div className="min-h-screen flex flex-grow flex-wrap bg-white items-start gap-y-7 max-lg:justify-center lg:gap-x-5 gap-10">
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
