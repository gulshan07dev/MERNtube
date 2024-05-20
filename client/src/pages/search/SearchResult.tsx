import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import PageLayout from "@/layout/PageLayout";
import videoService from "@/services/videoService";
import useService from "@/hooks/useService";
import { Video } from "@/store/slices/videoSlice";
import ScrollPagination from "@/component/ScrollPagination";
import EmptyMessage from "@/component/error/EmptyMessage";
import SearchVideoCard from "@/component/search/SearchVideoCard";

function SearchResult() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 0,
    totalPages: 1,
    totalDocs: 1,
    hasNextPage: true,
  });
  const [searchResults, setSearchResults] = useState<Video[]>([]);

  const {
    isLoading,
    error,
    handler: getAllVideos,
  } = useService(videoService.getAllVideos);

  const fetchSearchResults = async (query: string, page: number) => {
    if (page === 1) {
      setSearchResults([]);
    }

    const { success, error, responseData } = await getAllVideos({
      query,
      page,
      limit: 10,
    });

    if (success && !error) {
      const { page, totalPages, totalDocs, hasNextPage, docs } =
        responseData?.data?.result;

      setSearchResults((prevSearchResults) =>
        page === 1 ? docs : [...prevSearchResults, ...docs]
      );
      setPaginationInfo({
        currentPage: page,
        totalPages,
        totalDocs,
        hasNextPage,
      });
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    if (query) {
      setSearchQuery(query);
      fetchSearchResults(query, 1);
    }
  }, [location.search]);

  return (
    <PageLayout className="flex flex-col gap-7">
      <h1 className="text-lg font-nunito_sans text-zinc-800 dark:text-slate-100">
        {isLoading ? "Searching" : "Search"} Results for "{searchQuery}"
      </h1>
      <ScrollPagination
        paginationType="infinite-scroll"
        loadNextPage={() =>
          fetchSearchResults(searchQuery, paginationInfo?.currentPage + 1)
        }
        refreshHandler={() => fetchSearchResults(searchQuery, 1)}
        dataLength={searchResults.length}
        loading={isLoading}
        error={error?.message}
        currentPage={paginationInfo.currentPage}
        totalItems={paginationInfo.totalDocs}
        totalPages={paginationInfo.totalPages}
        hasNextPage={paginationInfo.hasNextPage}
        endMessage={
          <p className="py-4 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
            No more search results to show !!!
          </p>
        }
      >
        <div className="w-full flex flex-col md:gap-7 gap-2">
          {!searchResults.length &&
          paginationInfo.totalDocs === 0 &&
          paginationInfo.totalPages === 1 &&
          !isLoading ? (
            <EmptyMessage message="empty search results, try search another" />
          ) : (
            <>
              {searchResults?.map((item) => (
                <SearchVideoCard key={item?._id} video={item} />
              ))}
            </>
          )}
        </div>
      </ScrollPagination>
    </PageLayout>
  );
}

export default SearchResult;
