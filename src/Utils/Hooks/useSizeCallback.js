import { useLayoutEffect } from "react";

// eslint-disable-next-line import/prefer-default-export
export function useSizeCallback(target, callback) {
  useLayoutEffect(() => {
    if (!target) {
      return () => {
        //
      };
    }
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        callback({
          width: entry.target.clientWidth,
          height: entry.target.clientHeight,
        });
      });
    });
    resizeObserver.observe(target);
    return () => {
      resizeObserver.unobserve(target);
      resizeObserver.disconnect();
    };
  }, [target, callback]);
}
