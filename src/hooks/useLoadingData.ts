import { useEffect, useState } from 'react';

function useLoadingData<T = any> ({ initialData, fetchURL, filter }: {initialData: T[], fetchURL: string, filter: (query: string) => (data: T[]) => T[]}) {
  const [data, setData] = useState<T[]>(initialData);
  const [filteredData, setFilteredData] = useState<T[]>(initialData);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const updateData = (newData: T[]) => {
    setData(newData);
    setFilteredData(newData);
    setTimeout(() => setLoading(false), 2000);
  };

  const refresh = async () => {
    setLoading(true);
    fetch(fetchURL)
      .then<T[]>(response => response.json())
      .then(updateData);
  };

  const search = (query: string) => {
    setFilteredData(() => filter(query)(data));
  };

  useEffect(() => {
    if (fetchURL) {
      refresh();
    }
  }, [fetchURL]);

  return {
    data,
    loading,
    refresh,
    search,
    setData,
    filteredData,
    setFilteredData,
    favoriteIds,
    setFavoriteIds
  };
}

export default useLoadingData;
