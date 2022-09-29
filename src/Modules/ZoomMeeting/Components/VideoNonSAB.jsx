/* eslint-disable jsx-a11y/media-has-caption */
import _ from "lodash";
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ZoomContext from "../../../Contexts/ZoomContext";
import ZoomMediaContext from "../../../Contexts/ZoomMediaContext";
import isShallowEqual from "../../../Utils/Helpers/isShallowEqual";
import {
  isAndroidBrowser,
  isSupportOffscreenCanvas,
  isSupportWebCodecs,
} from "../../../Utils/Helpers/platform";
import { SELF_VIDEO_ID } from "../../../Utils/Helpers/zoomVideoConstants";
import { useSizeCallback } from "../../../Utils/Hooks/useSizeCallback";
import { useActiveVideo } from "../Hooks/useActiveVideo";
import { useCanvasDimension } from "../Hooks/useCanvasDimension";
import { useGalleryLayout } from "../Hooks/useGalleryLayout";
import { usePagination } from "../Hooks/usePagination";
import { useShare } from "../Hooks/useShare";
import Avatar from "./Avatar";
import Pagination from "./Pagination";
import VideoFooter from "./VideoFooter";

const isUseVideoElementToDrawSelfVideo =
  isAndroidBrowser() || isSupportOffscreenCanvas();

function VideoContainer({ setStatus }) {
  const zmClient = useContext(ZoomContext);
  const {
    mediaStream,
    video: { decode: isVideoDecodeReady },
  } = useContext(ZoomMediaContext);
  const videoRef = useRef(null);
  const shareRef = useRef(null);
  const selfShareRef = useRef(null);
  const shareContainerRef = useRef(null);
  const [containerDimension, setContainerDimension] = useState({
    width: 0,
    height: 0,
  });
  const [shareViewDimension, setShareViewDimension] = useState({
    width: 0,
    height: 0,
  });
  const canvasDimension = useCanvasDimension(mediaStream, videoRef);
  const activeVideo = useActiveVideo(zmClient);
  const { page, pageSize, totalPage, totalSize, setPage } =
    usePagination(zmClient, canvasDimension);
  const { visibleParticipants, layout: videoLayout } =
    useGalleryLayout(
      zmClient,
      mediaStream,
      isVideoDecodeReady,
      videoRef,
      canvasDimension,
      {
        page,
        pageSize,
        totalPage,
        totalSize,
      },
    );
  const { isReceiveSharing, isStartedShare, sharedContentDimension } =
    useShare(zmClient, mediaStream, shareRef);
  const isSharing = isReceiveSharing || isStartedShare;
  /**
   * position for self video
   */
  const currentUserIndex = visibleParticipants.findIndex(
    (user) => user.userId === zmClient.getCurrentUserInfo().userId,
  );
  let selfVideoLayout = null;
  if (currentUserIndex) {
    const item = videoLayout[currentUserIndex];
    if (item && canvasDimension) {
      selfVideoLayout = {
        ...item,
        y: canvasDimension.height - item.y - item.height,
      };
    }
  }

  const getParticipantVideoLayout = (userId) => {
    const userIndex = visibleParticipants.findIndex(
      (user) => user.userId === userId,
    );
    const item = videoLayout[userIndex];
    if (item && canvasDimension) {
      return {
        ...item,
        y: canvasDimension.height - item.y - item.height,
      };
    }
    return undefined;
  };

  useEffect(() => {
    if (isSharing && shareContainerRef.current) {
      const { width, height } = sharedContentDimension;
      const { width: containerWidth, height: containerHeight } =
        containerDimension;
      const ratio = Math.min(
        containerWidth / width,
        containerHeight / height,
        1,
      );
      setShareViewDimension({
        width: Math.floor(width * ratio),
        height: Math.floor(height * ratio),
      });
    }
  }, [isSharing, sharedContentDimension, containerDimension]);

  const onShareContainerResize = useCallback(({ width, height }) => {
    _.throttle(() => {
      setContainerDimension({ width, height });
    }, 50).call(this);
  }, []);
  useSizeCallback(shareContainerRef.current, onShareContainerResize);
  useEffect(() => {
    if (!isShallowEqual(shareViewDimension, sharedContentDimension)) {
      mediaStream?.updateSharingCanvasDimension(
        shareViewDimension.width,
        shareViewDimension.height,
      );
    }
  }, [mediaStream, sharedContentDimension, shareViewDimension]);

  return (
    <div className="overflow-hidden relative pt-[5vh] pb-[10vh] box-border w-[100vw] h-[100vh] bg-[#121619] flex">
      <div
        className={
          isSharing
            ? "flex flex-grow justify-center items-center overflow-hidden"
            : "hidden"
        }
        ref={shareContainerRef}
      >
        <div
          className="inline-block max-w-full"
          style={{
            width: `${shareViewDimension.width}px`,
            height: `${shareViewDimension.height}px`,
          }}
        >
          <canvas
            className={`${
              isStartedShare ? "hidden" : "w-full h-full rounded-md"
            }`}
            ref={shareRef}
          />
          {isSupportWebCodecs() ? (
            <video
              id="screen-share-canvas"
              className={`${
                isReceiveSharing
                  ? "hidden"
                  : "w-full h-full rounded-md"
              }`}
              ref={selfShareRef}
            />
          ) : (
            <canvas
              id="screen-share-canvas"
              className={`${
                isReceiveSharing
                  ? "hidden"
                  : "w-full h-full rounded-md"
              }`}
              ref={selfShareRef}
            />
          )}
        </div>
      </div>
      <div
        className={`relative h-full ${
          isSharing
            ? "w-[264px] flex-shrink-0 border-l-[#333]"
            : "w-full"
        }`}
      >
        <canvas
          className="w-full h-full rounded-md"
          id="video-canvas"
          width="800"
          height="600"
          ref={videoRef}
        />
        {isUseVideoElementToDrawSelfVideo && (
          <video
            id={SELF_VIDEO_ID}
            className="absolute rounded-md"
            style={
              selfVideoLayout
                ? {
                    display: "block",
                    width: `${selfVideoLayout.width}px`,
                    height: `${selfVideoLayout.height}px`,
                    top: `${selfVideoLayout.y}px`,
                    left: `${selfVideoLayout.x}px`,
                    pointerEvents: "none",
                  }
                : undefined
            }
          />
        )}
        <ul className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden p-0 m-0">
          {visibleParticipants.map((user, index) => {
            if (index > videoLayout.length - 1) {
              return null;
            }
            const dimension = videoLayout[index];
            const { width, height, x, y } = dimension;
            const { height: canvasHeight } = canvasDimension;
            return (
              <>
                {user.userId !== currentUserIndex && (
                  <video
                    id={user.userId}
                    className="absolute"
                    style={getParticipantVideoLayout(user.userId)}
                  />
                )}
                <Avatar
                  participant={user}
                  key={user.userId}
                  isActive={activeVideo === user.userId}
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    top: `${canvasHeight - y - height}px`,
                    left: `${x}px`,
                  }}
                />
              </>
            );
          })}
        </ul>
      </div>
      <VideoFooter
        className="absolute left-0 bottom-0"
        sharing
        shareRef={selfShareRef}
        setStatus={setStatus}
      />
      {totalPage > 1 && (
        <Pagination
          page={page}
          totalPage={totalPage}
          setPage={setPage}
          inSharing={isSharing}
        />
      )}
    </div>
  );
}

export default VideoContainer;
