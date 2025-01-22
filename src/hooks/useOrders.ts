"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export function useOrders() {
  const searchParams = useSearchParams();

  const query = searchParams.get('query') || '';
  const page = searchParams.get('page') || '1';

  const apiUrl = `/api/orders?query=${query}&page=${page}`;

  const { data, error, mutate } = useSWR(apiUrl, fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  return {
    orders: data?.orders ?? [],
    pagination: data?.pagination,
    isLoading: !error && !data,
    error,
    mutate,
  };
} 