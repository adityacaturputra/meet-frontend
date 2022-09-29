import ZoomVideo, { ConnectionState } from "@zoom/videosdk";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import { Loader } from "@mantine/core";
import Video from "../Components/Video";
import VideoNonSAB from "../Components/VideoNonSAB";
import VideoSingle from "../Components/VideoSingle";

import ZoomChatContext from "../../../Contexts/ZoomChatContext";
import ZoomContext from "../../../Contexts/ZoomContext";
import ZoomMediaContext from "../../../Contexts/ZoomMediaContext";
import ZoomRecordingContext from "../../../Contexts/ZoomRecordingContext";
import { isAndroidBrowser } from "../../../Utils/Helpers/platform";

const mediaShape = {
  audio: {
    encode: false,
    decode: false,
  },
  video: {
    encode: false,
    decode: false,
  },
  share: {
    encode: false,
    decode: false,
  },
};

const mediaReducer = (state, action) => {
  if (action.type === "reset-media") {
    return Object.assign(state, { ...mediaShape });
  }
  const splittedType = action.type.split("-");
  const type = splittedType[0];
  const subType = splittedType[1];

  return {
    ...state,
    [type]: {
      ...state[type],
      [subType]: action.value,
    },
  };
};

export default function ZoomMeeting({
  status,
  setStatus,
  isLoading,
  setIsLoading,
  meetingData,
}) {
  const [loadingText, setLoadingText] = useState("");
  const [isFailover, setIsFailover] = useState(false);

  const [mediaStream, setMediaStream] = useState(null);
  const [isSupportGalleryView, setIsSupportGalleryView] =
    useState(true);
  const [chatClient, setChatClient] = useState(null);
  const [recordingClient, setRecordingClient] = useState(null);
  const [commandClient, setCommandClient] = useState(null);

  const [mediaState, dispatch] = useReducer(mediaReducer, mediaShape);
  const zmClient = useContext(ZoomContext);

  const mediaContext = useMemo(
    () => ({ ...mediaState, mediaStream }),
    [mediaState, mediaStream],
  );
  const enforceGalleryView = true; // should be dynamic
  const galleryViewWithoutSAB =
    !!enforceGalleryView && !window.crossOriginIsolated;
  const webEndpoint = "zoom.us";

  const handleBeforeUnload = (e) => {
    const confirmationMessage =
      "There is an ongoing meeting. Are you sure you want to leave?";
    e.returnValue = confirmationMessage;
    return confirmationMessage;
  };

  const handleUnload = useCallback(async () => {
    const participants = await zmClient?.getAllUser();
    const isEndSession =
      zmClient.isHost() && participants.length === 1;
    await zmClient?.leave(isEndSession);
  }, [zmClient]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    const init = async () => {
      await zmClient.init("en-US", `${window.location.origin}/lib`, {
        webEndpoint,
        enforceMultipleVideos: galleryViewWithoutSAB,
        stayAwake: true,
      });
      setLoadingText("Joining the session...");
      await zmClient
        .join(
          meetingData.topic,
          meetingData.token,
          meetingData.userName,
          meetingData.password,
        )
        .then(async () => {
          const stream = await zmClient.getMediaStream();
          setMediaStream(stream);
          setIsSupportGalleryView(
            stream.isSupportMultipleVideos() && !isAndroidBrowser(),
          );
          const newChatClient = await zmClient.getChatClient();
          const newCommandClient = await zmClient.getCommandClient();
          const newRecordingClient =
            await zmClient.getRecordingClient();
          setChatClient(newChatClient);
          setCommandClient(newCommandClient);
          setRecordingClient(newRecordingClient);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    init();
    return () => {
      ZoomVideo.destroyClient();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [zmClient, webEndpoint, galleryViewWithoutSAB]);

  const onConnectionChange = useCallback(
    (payload) => {
      if (payload.state === ConnectionState.Reconnecting) {
        setIsLoading(true);
        setIsFailover(true);
        setStatus("connecting");
        const { reason } = payload;
        if (reason === "failover") {
          setLoadingText("Session Disconnected,Try to reconnect");
        }
      } else if (payload.state === ConnectionState.Connected) {
        setStatus("connected");
        if (isFailover) {
          setIsLoading(false);
        }
      } else if (payload.state === ConnectionState.Closed) {
        setStatus("closed");
        dispatch({ type: "reset-media" });
        if (payload.reason === "ended by host") {
          // Show alert modal
        }
      }
    },
    [isFailover],
  );
  const onMediaSDKChange = useCallback((payload) => {
    const { action, type, result } = payload;
    dispatch({
      type: `${type}-${action}`,
      value: result === "success",
    });
  }, []);

  const onDialoutChange = useCallback((payload) => {
    console.log("onDialoutChange", payload);
  }, []);

  const onAudioMerged = useCallback((payload) => {
    console.log("onAudioMerged", payload);
  }, []);

  useEffect(() => {
    zmClient.on("connection-change", onConnectionChange);
    zmClient.on("media-sdk-change", onMediaSDKChange);
    zmClient.on("dialout-state-change", onDialoutChange);
    zmClient.on("merged-audio", onAudioMerged);
    return () => {
      zmClient.off("connection-change", onConnectionChange);
      zmClient.off("media-sdk-change", onMediaSDKChange);
      zmClient.off("dialout-state-change", onDialoutChange);
      zmClient.off("merged-audio", onAudioMerged);
    };
  }, [
    zmClient,
    onConnectionChange,
    onMediaSDKChange,
    onDialoutChange,
    onAudioMerged,
  ]);

  return (
    <ZoomMediaContext.Provider value={mediaContext}>
      <ZoomChatContext.Provider value={chatClient}>
        <ZoomRecordingContext.Provider value={recordingClient}>
          {(() => {
            if (isLoading || status === "connecting") {
              return (
                <div className="flex flex-col gap-2 bg-[#121619] w-full h-screen justify-center items-center">
                  <Loader size="xl" />
                  <p className="text-white">{loadingText}</p>
                </div>
              );
            }
            if (isSupportGalleryView) {
              console.log("Gallery View is supported");
              return <Video setStatus={setStatus} />;
            }
            if (galleryViewWithoutSAB) {
              console.log("Gallery View is not supported");
              return <VideoNonSAB setStatus={setStatus} />;
            }
            console.log("Single video");
            return <VideoSingle setStatus={setStatus} />;
          })()}
        </ZoomRecordingContext.Provider>
      </ZoomChatContext.Provider>
    </ZoomMediaContext.Provider>
  );
}
