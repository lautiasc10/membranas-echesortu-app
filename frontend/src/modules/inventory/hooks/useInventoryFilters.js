import { useState } from "react";

export function useInventoryFilters() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [brand, setBrand] = useState("all");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("priority");

    function clearFilters() {
        setSearch("");
        setBrand("all");
        setCategory("all");
        setSort("priority");
        setPage(1);
    }

    function handleFilterChange(setter) {
        return (val) => {
            setter(val);
            setPage(1);
        };
    }

    return {
        page, setPage,
        search, setSearch,
        brand, setBrand,
        category, setCategory,
        sort, setSort,
        clearFilters,
        handleFilterChange
    };
}
