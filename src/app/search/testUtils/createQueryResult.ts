
import type {
  QueryObserverLoadingErrorResult,
  QueryObserverRefetchErrorResult,
  QueryObserverSuccessResult,
} from "@tanstack/react-query";

import type { SearchResult } from "@/src/components/utilities/types";

type QueryResultOverrides = {
  data?: SearchResult[];
  isFetching?: boolean;
  fetchStatus?: QueryObserverSuccessResult<
    SearchResult[],
    Error
  >["fetchStatus"];
};

export const createQueryResult = (
  overrides: QueryResultOverrides = {}
): QueryObserverSuccessResult<SearchResult[], Error> => {
  const data = overrides.data ?? [];
  const isFetching = overrides.isFetching ?? false;

  return {
    data,
    error: null,
    isError: false,
    isFetching,
    isLoading: false,
    isPending: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: true,
    isFetched: true,
    isFetchedAfterMount: true,
    isInitialLoading: false,
    isPaused: false,
    isPlaceholderData: false,
    isRefetching: isFetching,
    isStale: false,
    status: "success",
    fetchStatus: overrides.fetchStatus ?? (isFetching ? "fetching" : "idle"),
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    dataUpdatedAt: 0,
    isEnabled: true,
    refetch: jest.fn(),
  };
};

export const createLoadingErrorResult = (
  error: Error
): QueryObserverLoadingErrorResult<SearchResult[], Error> => ({
  ...createQueryResult(),
  data: undefined,
  error,
  isError: true,
  isSuccess: false,
  isLoadingError: true,
  isRefetchError: false,
  isPending: false,
  status: "error",
});

export const createRefetchErrorResult = (
  data: SearchResult[],
  error: Error
): QueryObserverRefetchErrorResult<SearchResult[], Error> => ({
  ...createQueryResult({ data }),
  error,
  isError: true,
  isSuccess: false,
  isLoadingError: false,
  isRefetchError: true,
  isPending: false,
  status: "error",
});
