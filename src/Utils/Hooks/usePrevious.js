import { useEffect, useRef } from "react";

// eslint-disable-next-line import/prefer-default-export
export function usePrevious(props) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = props;
  }, [props]);
  return ref.current;
}
