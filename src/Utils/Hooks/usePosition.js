/* eslint-disable no-param-reassign */
import { useLayoutEffect, useState } from "react";

// eslint-disable-next-line import/prefer-default-export
export function usePosition(ref) {
  const [position, setPosition] = useState({
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  });

  useLayoutEffect(() => {
    const updatePosition = () => {
      if (ref.current) {
        const { top, right, bottom, left } =
          ref.current.getBoundingClientRect();
        setPosition({ top, right, bottom, left });
      }
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [ref]);

  return position;
}
