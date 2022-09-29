import { useCallback, useEffect, useState } from "react";
import { usePrevious } from "../../../Utils/Hooks/usePrevious";

// eslint-disable-next-line import/prefer-default-export
export function useShare(zmClient, mediaStream, shareRef) {
  const [isReceiveSharing, setIsReceiveSharing] = useState(false);
  const [isStartedShare, setIsStartedShare] = useState(false);
  const [activeSharingId, setActiveSharingId] = useState(0);
  const [sharedContentDimension, setSharedContentDimension] =
    useState({
      width: 0,
      height: 0,
    });
  const [currentUserId, setCurrentUserId] = useState(0);
  const onActiveShareChange = useCallback(
    ({ state, userId }) => {
      if (!isStartedShare) {
        setActiveSharingId(userId);
        setIsReceiveSharing(state === "Active");
      }
    },
    [isStartedShare],
  );
  const onSharedContentDimensionChange = useCallback(
    ({ width, height }) => {
      setSharedContentDimension({ width, height });
    },
    [],
  );
  const onCurrentUserUpdate = useCallback(
    (payload) => {
      if (Array.isArray(payload) && payload.length > 0) {
        payload.forEach((item) => {
          if (
            item.userId === currentUserId &&
            item.sharerOn !== undefined
          ) {
            setIsStartedShare(item.sharerOn);
            if (item.sharerOn) {
              setIsReceiveSharing(false);
            }
          }
        });
      }
    },
    [currentUserId],
  );
  useEffect(() => {
    zmClient.on("active-share-change", onActiveShareChange);
    zmClient.on(
      "share-content-dimension-change",
      onSharedContentDimensionChange,
    );
    zmClient.on("user-updated", onCurrentUserUpdate);
    return () => {
      zmClient.off("active-share-change", onActiveShareChange);
      zmClient.off(
        "share-content-dimension-change",
        onSharedContentDimensionChange,
      );
      zmClient.off("user-updated", onCurrentUserUpdate);
    };
  }, [
    zmClient,
    onActiveShareChange,
    onSharedContentDimensionChange,
    onCurrentUserUpdate,
  ]);
  const previousIsRecieveSharing = usePrevious(isReceiveSharing);
  useEffect(() => {
    if (
      shareRef.current &&
      previousIsRecieveSharing !== isReceiveSharing
    ) {
      if (isReceiveSharing) {
        mediaStream?.startShareView(
          shareRef.current,
          activeSharingId,
        );
      } else if (
        previousIsRecieveSharing === true &&
        isReceiveSharing === false
      ) {
        mediaStream?.stopShareView();
      }
    }
  }, [
    mediaStream,
    shareRef,
    previousIsRecieveSharing,
    isReceiveSharing,
    activeSharingId,
  ]);
  useEffect(() => {
    if (mediaStream) {
      const activeSharedUserId = mediaStream.getActiveShareUserId();
      if (activeSharedUserId) {
        setIsReceiveSharing(true);
        setActiveSharingId(activeSharedUserId);
      }
    }
  }, [mediaStream]);
  useEffect(() => {
    const currentUser = zmClient.getCurrentUserInfo();
    if (currentUser) {
      setCurrentUserId(currentUser.userId);
    }
  }, []);
  useEffect(() => {
    return () => {
      if (isReceiveSharing) {
        mediaStream?.stopShareView();
      }
    };
  }, []);
  return { isReceiveSharing, isStartedShare, sharedContentDimension };
}
