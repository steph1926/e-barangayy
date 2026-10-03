import { useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
/** Reads the ?status= value set by the admin sidebar status dropdowns. */
export function useStatusFilter() {
  const searchStr = useRouterState({ select: (state) => state.location.searchStr });
  return useMemo(() => {
    const value = new URLSearchParams(searchStr).get("status");
    return value && value.trim() ? value : null;
  }, [searchStr]);
}
export function matchesStatus(item, status) {
  return !status || String(item.status) === status;
}
