import { useMemo, useState } from 'react';

type FilterFn<T> = (item: T, term: string) => boolean;

const defaultFilter = <T extends object>(item: T, term: string): boolean => {
  const search = term.toLowerCase();

  // aqui fazemos cast interno, não exigimos que T seja Record
  const values = Object.values(item as Record<string, unknown>);

  return values.some(
    (value) =>
      typeof value === 'string' && value.toLowerCase().includes(search),
  );
};

export function useTable<T extends object>(
  data: T[],
  filterFn: FilterFn<T> = defaultFilter,
) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) => filterFn(item, searchTerm));
  }, [data, searchTerm, filterFn]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return {
    filteredData,
    searchTerm,
    handleSearch,
    setSearchTerm,
  };
}

export default useTable;
