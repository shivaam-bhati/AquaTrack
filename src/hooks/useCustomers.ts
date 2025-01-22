"use client";

import useSWR from "swr";
import { usePathname, useSearchParams } from "next/navigation";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
};

export function useCustomers() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const query = searchParams.get('query') || '';
  const page = searchParams.get('page') || '1';
  
  const apiUrl = pathname.includes("orders") ? "/api/customers?dropdown=true" : `/api/customers?query=${query}&page=${page}`;

  const { data, error, mutate } = useSWR(
    apiUrl,
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