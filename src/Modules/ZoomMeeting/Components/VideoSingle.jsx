import { VideoQuality } from "@zoom/videosdk";
import _ from "lodash";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
import { useCanvasDimension } from "../Hooks/useCanvasDimension";
import { useParticipantsChange } from "../Hooks/useParticipantsChange";
import { useShare } from "../Hooks/useShare";
import Avatar from "./Avatar";
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
  const [participants, setParticipants] = useState([]);
  const [activeVideo, setActiveVideo] = useState(0);
  const previousActiveUser = useRef();
  const canvasDimension = useCanvasDimension(mediaStream, videoRef);
  const { isReceiveSharing, isStartedShare, sharedContentDimension } =
    useShare(zmClient, mediaStream, shareRef);
  const isSharing = isReceiveSharing || isStartedShare;
  const [containerDimension, setContainerDimension] = useState({
    width: 0,
    height: 0,
  });
  const [shareViewDimension, setShareViewDimension] = useState({
    width: 0,
    height: 0,
  });

  useParticipantsChange(zmClient, (payload) => {
    setParticipants(payload);
  });
  const onActiveVideoChange = useCallback((payload) => {
    const { userId } = payload;
    setActiveVideo(userId);
  }, []);
  useEffect(() => {
    zmClient.on("video-active-change", onActiveVideoChange);
    return () => {
      zmClient.off("video-active-change", onActiveVideoChange);
    };
  }, [zmClient, onActiveVideoChange]);

  const activeUser = useMemo(
    () => participants.find((user) => user.userId === activeVideo),
    [participants, activeVideo],
  );
  const isCurrentUserStartedVideo =
    zmClient.getCurrentUserInfo()?.bVideoOn;
  useEffect(() => {
    if (mediaStream && videoRef.current && isVideoDecodeReady) {
      if (
        activeUser?.bVideoOn !== previousActiveUser.current?.bVideoOn
      ) {
        if (activeUser?.bVideoOn) {
          mediaStream.renderVideo(
            videoRef.current,
            activeUser.userId,
            canvasDimension.width,
            canvasDimension.height,
            0,
            0,
            VideoQuality.Video_360P,
          );
        } else if (previousActiveUser.current?.bVideoOn) {
          mediaStream.stopRenderVideo(
            videoRef.current,
            previousActiveUser.current?.userId,
          );
        }
      }
      if (
        activeUser?.bVideoOn &&
        previousActiveUser.current?.bVideoOn &&
        activeUser.userId !== previousActiveUser.current.userId
      ) {
        mediaStream.stopRenderVideo(
          videoRef.current,
          previousActiveUser.current?.userId,
        );
        mediaStream.renderVideo(
          videoRef.current,
          activeUser.userId,
          canvasDimension.width,
          canvasDimension.height,
          0,
          0,
          VideoQuality.Video_360P,
        );
      }
      previousActiveUser.current = activeUser;
    }
  }, [mediaStream, activeUser, isVideoDecodeReady, canvasDimension]);
  useEffect(() => {
    if (mediaStream) {
      setActiveVideo(mediaStream.getActiveVideoId());
    }
  }, []);
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
    <div className="relative pt-[5vh] pb-[10vh] box-border w-[100vw] h-[100vh] bg-[#121619] flex">
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
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              className={`${
                isReceiveSharing
                  ? "hidden"
                  : "w-full h-full rounded-md"
              }`}
              ref={selfShareRef}
            />
          ) : (
            <canvas
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
        {isUseVideoElementToDrawSelfVideo ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            id={SELF_VIDEO_ID}
            className={`absolute z-[2] rounded-md ${
              participants.length === 1
                ? "w-full h-full"
                : "w-[254px] h-[143px] top-[50px] right-[30px]"
            } ${isCurrentUserStartedVideo ? "block" : "hidden"}`}
          />
        ) : (
          <canvas
            id={SELF_VIDEO_ID}
            width="254"
            height="143"
            className={`absolute z-[2] rounded-md ${
              participants.length === 1
                ? "w-full h-full"
                : "w-[254px] h-[143px] top-[50px] right-[30px]"
            } ${isCurrentUserStartedVideo ? "block" : "hidden"}`}
          />
        )}
        {activeUser && (
          <Avatar
            participant={activeUser}
            isActive={false}
            className="top-0 left-0"
            style={{
              width: canvasDimension.width,
              height: canvasDimension.height,
            }}
          />
        )}
      </div>
      <VideoFooter
        className="absolute left-0 bottom-0"
        sharing
        shareRef={selfShareRef}
        setStatus={setStatus}
      />
    </div>
  );
}

export default VideoContainer;
