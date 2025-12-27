import { useState, useCallback } from "react";

type UseSearchOptions<T> = {
  searchFn?: (query: string) => Promise<T[]> | T[];
  debounceMs?: number;
};

export default function useSearch<T>(options?: UseSearchOptions<T>) {
  const { searchFn, debounceMs = 300 } = options ?? {};
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<T[]>([]);

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);

      if (!searchFn) {
        return;
      }

      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        const results = await searchFn(query);
        setSearchResults(Array.isArray(results) ? results : []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [searchFn]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  return {
    searchQuery,
    isSearching,
    searchResults,
    handleSearch,
    clearSearch,
  };
}


