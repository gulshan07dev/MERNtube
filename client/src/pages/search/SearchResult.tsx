import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import PageLayout from "@/layout/PageLayout";
import useActionHandler from "@/hooks/useActionHandler";
import { Video, getAllVideos } from "@/store/slices/videoSlice";
import ScrollPagination from "@/component/ScrollPagination";
import EmptyMessage from "@/component/error/EmptyMessage";
import SearchVideoCard from "@/component/search/SearchVideoCard";

function SearchResult() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchResults, setSearchResults] = useState<Video[]>([]);

  const { isLoading, error, handleAction } = useActionHandler({
    action: getAllVideos,
    isShowToastMessage: false,
  });

  const fetchSearchResults = async (query: string, page: number) => {
    const { isSuccess, error, resData } = await handleAction({
      query,
      page,
      limit: 10,
    });

    if (isSuccess && !error) {
      setSearchResults((prevSearchResults) =>
        page === 1
          ? resData.result.docs
          : [...prevSearchResults, ...resData.result.docs]
      );
      setCurrentPage(resData.result.page);
      setTotalPages(resData.result.totalPages);
      setTotalVideos(resData.result.totalDocs);
      setHasNextPage(resData.result.hasNextPage);
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
        Search Results for "{searchQuery}"
      </h1>
      <ScrollPagination
        paginationType="infinite-scroll"
        loadNextPage={() => fetchSearchResults(searchQuery, currentPage + 1)}
        refreshHandler={() => fetchSearchResults(searchQuery, 1)}
        dataLength={searchResults.length}
        loading={isLoading}
        error={error}
        currentPage={currentPage}
        totalItems={totalVideos}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        endMessage={
          <p className="py-4 text-lg text-gray-800 dark:text-white text-center font-Noto_sans">
            No more search results to show !!!
          </p>
        }
      >
        <div className="w-full flex flex-col md:gap-7 gap-2">
          {!searchResults.length &&
          totalVideos === 0 &&
          totalPages === 1 &&
          !isLoading ? (
            <EmptyMessage message="empty search results, try search another" />
          ) : (
            <>
              {searchResults?.map((item) => (
                <SearchVideoCard key={item?._id} video={item} />
              ))}
            </>
          )}
          {isLoading && <p>loading...</p>}
        </div>
      </ScrollPagination>
    </PageLayout>
  );
}

export default SearchResult;
