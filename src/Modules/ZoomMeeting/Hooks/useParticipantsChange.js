import { useCallback, useEffect, useRef } from "react";

// eslint-disable-next-line import/prefer-default-export
export function useParticipantsChange(zmClient, fn) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const callback = useCallback(() => {
    const participants = zmClient.getAllUser();
    fnRef.current?.(participants);
  }, [zmClient]);
  useEffect(() => {
    zmClient.on("user-added", callback);
    zmClient.on("user-removed", callback);
    zmClient.on("user-updated", callback);
    return () => {
      zmClient.off("user-added", callback);
      zmClient.off("user-removed", callback);
      zmClient.off("user-updated", callback);
    };
  }, [zmClient, callback]);
  useEffect(() => {
    callback();
  }, []);
}
