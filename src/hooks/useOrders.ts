"use client";

import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export function useOrders() {
  const { data, error, mutate } = useSWR("/api/orders", fetcher, {
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