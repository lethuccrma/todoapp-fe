import { useCallback, useEffect, useState } from "react";
import AuthorizedAPI from "../../apis/authorized";
import { GET_TODOS } from "../../configs/server";
import { ICardData } from "../../types/ICard";
import qs from 'qs';
import IPagination from "../../types/IPage";

function useTodos({
  page,
  take,
}: {page: number; take: number}) {
  const [todos, setTodos] = useState<ICardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [pagination, setPagination] = useState<{haveNextPage: boolean; total: number}>({haveNextPage: false, total: 0});

  const fetchTodos = useCallback(() => {
    setLoading(true);
    AuthorizedAPI.get<{data: {todos: ICardData[]}; pagination: IPagination}>(`${GET_TODOS}?${qs.stringify({page, take})}`)
      .then((result) => {
        console.log('result', result);
        setTodos(result.data.data.todos);
        setPagination(result.data.pagination);
      })
      .catch(err => {
        setError(err?.response?.data?.message || err.message)
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, take]);

  useEffect(() => {
    fetchTodos();
  }, [page, take]);

  return {
    todos,
    loading,
    error,
    refetch: fetchTodos,
    pagination: {
      page,
      take,
      ...pagination,
    },
  }
}

export default useTodos;
