import { useState, useCallback } from "react";

export function usePagination(initialPageSize = 10) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [query, setQuery] = useState("");

    // Sort parameter as generic string "field_dir"
    const [sort, setSort] = useState(null);

    const onQueryChange = useCallback((newQuery) => {
        setQuery(newQuery);
        setPage(1); // Reset page on query
    }, []);

    const onSortChange = useCallback((newSort) => {
        setSort(newSort);
        setPage(1); // Reset page on sort
    }, []);

    const onPageChange = useCallback((newPage) => {
        setPage(newPage);
    }, []);

    const onPageSizeChange = useCallback((newSize) => {
        setPageSize(newSize);
        setPage(1); // Reset page on sizes
    }, []);

    return {
        page,
        pageSize,
        query,
        sort,
        onQueryChange,
        onSortChange,
        onPageChange,
        onPageSizeChange,
        setPage
    };
}
