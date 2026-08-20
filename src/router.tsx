import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Off by design: Lenis owns the scroll and GSAP pinning changes page height after
    // navigation, so a restored offset lands in the wrong place. useScrollReset handles it.
    scrollRestoration: false,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
