"use client";

import useSWR from "swr";
import { useSearchParams } from "next/navigation";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
};

export function useCustomers() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const page = searchParams.get('page') || '1';

  const { data, error, mutate } = useSWR(
    `/api/customers?query=${query}&page=${page}`,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    }
  );

  return {
    customers: data?.customers ?? [],
    pagination: data?.pagination,
    isLoading: !error && !data,
    error,
    mutate,
  };
} 