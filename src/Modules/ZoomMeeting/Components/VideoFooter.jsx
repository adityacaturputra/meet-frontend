import { Button, Menu } from "@mantine/core";
import {
  AudioChangeAction,
  MutedSource,
  VideoCapturingState,
} from "@zoom/videosdk";

import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ZoomContext from "../../../Contexts/ZoomContext";
import ZoomMediaContext from "../../../Contexts/ZoomMediaContext";
import ZoomRecordingContext from "../../../Contexts/ZoomRecordingContext";
import {
  isAndroidBrowser,
  isSupportOffscreenCanvas,
} from "../../../Utils/Helpers/platform";
import { SELF_VIDEO_ID } from "../../../Utils/Helpers/zoomVideoConstants";
import CameraButton from "./Camera";
import ChatButton from "./Chat";
import MicrophoneButton from "./Microphone";
import ParticipantsButton from "./Participants";
import { getRecordingButtons } from "./Recording";
import { ScreenShareButton } from "./ScreenShare";
import SettingsButton from "./Settings";

const isAudioEnable = typeof AudioWorklet === "function";
function VideoFooter({ className, shareRef, sharing, setStatus }) {
  const navigate = useNavigate();
  const deviceSettings = useSelector((state) => state.zoomSettings);
  const [isStartedAudio, setIsStartedAudio] = useState(false);
  const [isStartedVideo, setIsStartedVideo] = useState(false);
  const [audio, setAudio] = useState("");
  const [isStartedScreenShare, setIsStartedScreenShare] =
    useState(false);
  const [isMirrored, setIsMirrored] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeMicrophone, setActiveMicrophone] = useState("");
  const [activeSpeaker, setActiveSpeaker] = useState("");
  const [activeCamera, setActiveCamera] = useState("");
  const [micList, setMicList] = useState([]);
  const [speakerList, setSpeakerList] = useState([]);
  const [cameraList, setCameraList] = useState([]);

  const [isComputerAudioDisabled, setIsComputerAudioDisabled] =
    useState(false);
  const { mediaStream } = useContext(ZoomMediaContext);
  const recordingClient = useContext(ZoomRecordingContext);
  const [recordingStatus, setRecordingStatus] = useState(
    recordingClient?.getCloudRecordingStatus() || "",
  );
  const zmClient = useContext(ZoomContext);

  const onCameraClick = useCallback(async () => {
    if (isStartedVideo) {
      await mediaStream?.stopVideo();
      setIsStartedVideo(false);
    } else {
      if (
        isAndroidBrowser() ||
        (isSupportOffscreenCanvas() &&
          !mediaStream?.isSupportMultipleVideos())
      ) {
        const videoElement = document.querySelector(
          `#${SELF_VIDEO_ID}`,
        );
        if (videoElement) {
          await mediaStream?.startVideo({ videoElement });
        }
      } else {
        const startVideoOptions = { hd: false };
        // if (mediaStream?.isSupportVirtualBackground()) {
        //   Object.assign(startVideoOptions, {
        //     virtualBackground: { imageUrl: "blur" },
        //   });
        // }
        await mediaStream?.startVideo(startVideoOptions);
        if (!mediaStream?.isSupportMultipleVideos()) {
          const canvasElement = document.querySelector(
            `#${SELF_VIDEO_ID}`,
          );
          mediaStream?.renderVideo(
            canvasElement,
            zmClient.getSessionInfo().userId,
            254,
            143,
            0,
            0,
            3,
          );
        }
      }
      setIsStartedVideo(true);
    }
  }, [mediaStream, isStartedVideo, zmClient]);
  const onMicrophoneClick = useCallback(async () => {
    if (isStartedAudio) {
      if (isMuted) {
        await mediaStream?.unmuteAudio();
        setIsMuted(false);
      } else {
        await mediaStream?.muteAudio();
        setIsMuted(true);
      }
    } else {
      await mediaStream?.startAudio();
      mediaStream?.muteAudio();
      setIsStartedAudio(true);
    }
  }, [mediaStream, isMuted, isStartedAudio]);
  const onMicrophoneMenuClick = async (key) => {
    if (mediaStream) {
      const [type, deviceId] = key.split("|");
      if (type === "microphone") {
        if (deviceId !== activeMicrophone) {
          await mediaStream.switchMicrophone(deviceId);
          setActiveMicrophone(deviceId);
        }
      } else if (type === "speaker") {
        if (deviceId !== activeSpeaker) {
          await mediaStream.switchSpeaker(deviceId);
          setActiveMicrophone(deviceId);
        }
      } else if (type === "leave audio") {
        if (audio === "computer") {
          await mediaStream.stopAudio();
        }
        setIsStartedAudio(false);
      }
    }
  };
  const onSwitchCamera = async (key) => {
    if (mediaStream) {
      if (activeCamera !== key) {
        await mediaStream.switchCamera(key);
        setActiveCamera(key);
      }
    }
  };
  const onMirrorVideo = async () => {
    await mediaStream?.mirrorVideo(!isMirrored);
    setIsMirrored(!isMirrored);
  };
  const onHostAudioMuted = useCallback((payload) => {
    const { action, source, type } = payload;
    if (action === AudioChangeAction.Join) {
      setIsStartedAudio(true);
      setAudio(type);
    } else if (action === AudioChangeAction.Leave) {
      setIsStartedAudio(false);
    } else if (action === AudioChangeAction.Muted) {
      setIsMuted(true);
      if (source === MutedSource.PassiveByMuteOne) {
        // Display warning "Host muted you"
      }
    } else if (action === AudioChangeAction.Unmuted) {
      setIsMuted(false);
      if (source === "passive") {
        // Display warning "Host unmuted you"
      }
    }
  }, []);
  const onScreenShareClick = useCallback(async () => {
    if (!isStartedScreenShare && shareRef && shareRef.current) {
      await mediaStream?.startShareScreen(shareRef.current);
      setIsStartedScreenShare(true);
    } else if (isStartedScreenShare) {
      await mediaStream?.stopShareScreen();
      setIsStartedScreenShare(false);
    }
  }, [mediaStream, isStartedScreenShare, shareRef]);
  const onPassivelyStopShare = useCallback(({ reason }) => {
    console.log("passively stop reason:", reason);
    setIsStartedScreenShare(false);
  }, []);
  const onDeviceChange = useCallback(() => {
    if (mediaStream) {
      const mics = mediaStream.getMicList();
      const speakers = mediaStream.getSpeakerList();
      const cameras = mediaStream.getCameraList();
      setMicList(mics);
      setSpeakerList(speakers);
      setCameraList(cameras);
      setActiveMicrophone(mediaStream.getActiveMicrophone());
      setActiveSpeaker(mediaStream.getActiveSpeaker());
      setActiveCamera(mediaStream.getActiveCamera());
    }
  }, [mediaStream]);

  const onRecordingChange = useCallback(() => {
    setRecordingStatus(
      recordingClient?.getCloudRecordingStatus() || "",
    );
  }, [recordingClient]);

  useEffect(() => {
    console.log("active devices", {
      activeCamera,
      activeMicrophone,
      activeSpeaker,
    });
  }, [activeCamera, activeMicrophone, activeSpeaker]);
  const onRecordingClick = async (key) => {
    switch (key) {
      case "Record": {
        await recordingClient?.startCloudRecording();
        break;
      }
      case "Resume": {
        await recordingClient?.resumeCloudRecording();
        break;
      }
      case "Stop": {
        await recordingClient?.stopCloudRecording();
        break;
      }
      case "Pause": {
        await recordingClient?.pauseCloudRecording();
        break;
      }
      case "Status": {
        break;
      }
      default: {
        await recordingClient?.startCloudRecording();
      }
    }
  };

  const onVideoCaptureChange = useCallback((payload) => {
    if (payload.state === VideoCapturingState.Started) {
      setIsStartedVideo(true);
    } else {
      setIsStartedVideo(false);
    }
  }, []);

  const onShareAudioChange = useCallback((payload) => {
    const { state } = payload;
    if (state === "on") {
      setIsComputerAudioDisabled(true);
    } else if (state === "off") {
      setIsComputerAudioDisabled(false);
    }
  }, []);

  const handleLeaveorEndSession = (isHost = false) => {
    zmClient.leave(isHost);
    const message = isHost
      ? "You've ended the meeting"
      : "You have left the meeting";
    navigate("/end", { replace: true, state: { message } });
  };

  useEffect(() => {
    zmClient.on("current-audio-change", onHostAudioMuted);
    zmClient.on("passively-stop-share", onPassivelyStopShare);
    zmClient.on("device-change", onDeviceChange);
    zmClient.on("recording-change", onRecordingChange);
    zmClient.on("video-capturing-change", onVideoCaptureChange);
    zmClient.on("share-audio-change", onShareAudioChange);
    return () => {
      zmClient.off("current-audio-change", onHostAudioMuted);
      zmClient.off("passively-stop-share", onPassivelyStopShare);
      zmClient.off("device-change", onDeviceChange);
      zmClient.off("recording-change", onRecordingChange);
      zmClient.off("video-capturing-change", onVideoCaptureChange);
      zmClient.off("share-audio-change", onShareAudioChange);
    };
  }, [
    zmClient,
    onHostAudioMuted,
    onPassivelyStopShare,
    onDeviceChange,
    onRecordingChange,
    onVideoCaptureChange,
    onShareAudioChange,
  ]);

  useEffect(() => {
    return () => {
      if (isStartedAudio) {
        mediaStream?.stopAudio();
      }
      if (isStartedVideo) {
        mediaStream?.stopVideo();
      }
      if (isStartedScreenShare) {
        mediaStream?.stopShareScreen();
      }
    };
  }, []);

  const recordingButtons = getRecordingButtons(
    recordingStatus,
    zmClient.isHost(),
  );

  return (
    <div
      className={`flex px-6 justify-between items-center h-[10vh] w-full bg-[#1B1F23] text-white/80 ${className}`}
    >
      {/* TODO: Uncomment when Cloud Recording is available */}
      {/* <div className="flex gap-3">
        <Icon
          icon="fluent:record-32-regular"
          className="text-red-500"
        />
        <span className="text-sm">12:03</span>
      </div> */}
      <div />

      <div className="flex gap-11">
        {isAudioEnable && (
          <MicrophoneButton
            isStartedAudio={isStartedAudio}
            isMuted={isMuted}
            audio={audio}
            onMicrophoneClick={onMicrophoneClick}
          />
        )}
        <CameraButton
          isStartedVideo={isStartedVideo}
          onCameraClick={onCameraClick}
        />
        <ParticipantsButton />
        {sharing && (
          <ScreenShareButton
            isStartedScreenShare={isStartedScreenShare}
            onScreenShareClick={onScreenShareClick}
          />
        )}

        {/* TODO: Uncomment when Cloud Recording is available */}
        {/* {recordingButtons.map((button) => {
          return (
            <RecordingButton
              key={button.text}
              onClick={() => {
                onRecordingClick(button.text);
              }}
              text={button.text}
              tipText={button.tipText}
              icon={button.icon}
              color={button.color}
            />
          );
        })} */}

        <ChatButton />
        {isStartedAudio && (
          <SettingsButton
            cameraList={cameraList}
            microphoneList={micList}
            speakerList={speakerList}
            activeCamera={activeCamera}
            activeMicrophone={activeMicrophone}
            activeSpeaker={activeSpeaker}
            audio={audio}
            withMirrorVideo={isStartedVideo}
            withLeaveAudio={isStartedAudio}
            isMirrored={isMirrored}
            onMirrorVideo={onMirrorVideo}
            onSwitchCamera={onSwitchCamera}
            onMicrophoneMenuClick={onMicrophoneMenuClick}
          />
        )}
      </div>
      {/* <AudioVideoStatisticModal
        visible={statisticVisible}
        setVisible={setStatisticVisible}
        defaultTab={selecetedStatisticTab}
        isStartedAudio={isStartedAudio}
        isMuted={isMuted}
        isStartedVideo={isStartedVideo}
      /> */}
      {/* {(zmClient.isManager() || zmClient.isHost()) && (
        <ScreenShareLockButton
          isLockedScreenShare={isLockedScreenShare}
          onScreenShareLockClick={() => {
            mediaStream?.lockShare(!isLockedScreenShare);
            setIsLockedScreenShare(!isLockedScreenShare);
          }}
        />
      )} */}
      <Menu
        classNames={{
          dropdown: "bg-white/0 border-0",
          item: "w-full my-3 text-center text-white text-xs",
        }}
        position="top-end"
      >
        <Menu.Target>
          <Button color="red" size="xs">
            End Meeting
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {zmClient.isHost() && (
            <Menu.Item
              className="bg-red-500"
              onClick={() => handleLeaveorEndSession(true)}
            >
              End Meeting for All
            </Menu.Item>
          )}
          <Menu.Item
            className="bg-[#121619] border-white"
            onClick={() => handleLeaveorEndSession()}
          >
            Leave Meeting
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
export default VideoFooter;
