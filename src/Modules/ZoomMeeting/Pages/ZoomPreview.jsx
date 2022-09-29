import { Icon } from "@iconify/react";
import { Button, Switch } from "@mantine/core";
import ZoomVideo from "@zoom/videosdk";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setZoomSettings } from "../../../Configs/Redux/slice";
import getUserCookie from "../../../Utils/Helpers/getUserCookie";
import { usePosition } from "../../../Utils/Hooks/usePosition";
import Avatar from "../Components/Avatar";
import SettingsButton from "../Components/Settings";

let micFeedBackInteval = "";

let localAudio = ZoomVideo.createLocalAudioTrack();
let localVideo = ZoomVideo.createLocalVideoTrack();
let allDevices;

const mountDevices = async () => {
  allDevices = await ZoomVideo.getDevices();
  const cameraDevices = allDevices.filter((device) => {
    return device.kind === "videoinput";
  });
  const micDevices = allDevices.filter((device) => {
    return device.kind === "audioinput";
  });
  const speakerDevices = allDevices.filter((device) => {
    return device.kind === "audiooutput";
  });
  return {
    mics: micDevices.map((item) => {
      return { label: item.label, deviceId: item.deviceId };
    }),
    speakers: speakerDevices.map((item) => {
      return { label: item.label, deviceId: item.deviceId };
    }),
    cameras: cameraDevices.map((item) => {
      return { label: item.label, deviceId: item.deviceId };
    }),
  };
};

let PREVIEW_VIDEO;

export default function ZoomPreview({ onClickJoin, disabledJoin }) {
  const user = getUserCookie();
  const deviceSettings = useSelector((state) => state.zoomSettings);
  const [deviceState, setDeviceState] = useState({
    ...deviceSettings,
  });
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const position = usePosition(videoRef);
  const [isStartedAudio, setIsStartedAudio] = useState(
    !deviceSettings.isMuted,
  );
  const [isMuted, setIsMuted] = useState(deviceSettings.isMuted);
  const [isStartedVideo, setIsStartedVideo] = useState(
    deviceSettings.isStartedVideo,
  );
  const [micList, setMicList] = useState([]);
  const [speakerList, setSpeakerList] = useState([]);
  const [cameraList, setCameraList] = useState([]);
  const [activeMicrophone, setActiveMicrophone] = useState("");
  const [activeSpeaker, setActiveSpeaker] = useState("");
  const [activeCamera, setActiveCamera] = useState("");
  const [micVolume, setMicVolume] = useState(0);
  const [switches, setSwitches] = useState({
    camera: deviceSettings.isStartedVideo,
    mic: !deviceSettings.isMuted,
  });

  const onCameraClick = useCallback(async () => {
    setDeviceState((prev) => ({
      ...prev,
      isStartedVideo: !isStartedVideo,
    }));
    if (isStartedVideo) {
      await localVideo?.stop();
      setIsStartedVideo(false);
    } else {
      await localVideo?.start(PREVIEW_VIDEO);
      setIsStartedVideo(true);
    }
  }, [isStartedVideo]);

  const onMicrophoneClick = useCallback(async () => {
    const unmute = async () => {
      await localAudio?.unmute();
      micFeedBackInteval = setInterval(
        () => setMicVolume(localAudio.getCurrentVolume()),
        500,
      );
      setIsMuted(false);
    };
    setDeviceState((prev) => ({
      ...prev,
      isMuted: !isMuted,
    }));
    if (isStartedAudio) {
      if (isMuted) {
        unmute();
      } else {
        await localAudio?.mute();
        if (micFeedBackInteval) {
          clearInterval(micFeedBackInteval);
          setMicVolume(0);
        }
        setIsMuted(true);
      }
    } else {
      await localAudio?.start();
      setIsStartedAudio(true);
      unmute();
    }
  }, [isStartedAudio, isMuted]);

  const onMicrophoneMenuClick = async (key) => {
    const [type, deviceId] = key.split("|");
    if (type === "microphone") {
      if (deviceId !== activeMicrophone) {
        if (isStartedAudio) {
          await localAudio.stop();
        }
        setIsMuted(true);
        localAudio = ZoomVideo.createLocalAudioTrack(deviceId);
        if (!isStartedAudio) {
          await localAudio.start();
        }
        setIsMuted(false);
        setActiveMicrophone(deviceId);
        setDeviceState((prev) => ({ ...prev, inputId: deviceId }));
      }
    } else if (type === "speaker") {
      if (deviceId !== activeSpeaker) {
        setActiveSpeaker(deviceId);
        setDeviceState((prev) => ({ ...prev, outputId: deviceId }));
      }
    }
  };

  const onSwitchCamera = async (key) => {
    if (localVideo) {
      if (activeCamera !== key) {
        if (isStartedVideo) {
          await localVideo.stop();
        }
        localVideo = ZoomVideo.createLocalVideoTrack(key);
        if (isStartedVideo) {
          localVideo.start(PREVIEW_VIDEO);
        }
        setActiveCamera(key);
        setDeviceState((prev) => ({ ...prev, cameraId: key }));
      }
    }
  };

  useEffect(() => {
    PREVIEW_VIDEO = document.getElementById("video-preview");
    mountDevices().then(async (devices) => {
      setMicList(devices.mics);
      setCameraList(devices.cameras);
      setSpeakerList(devices.speakers);
      setActiveCamera(
        deviceSettings.cameraId || devices.cameras[0].deviceId,
      );
      setActiveMicrophone(
        deviceSettings.inputId || devices.mics[0].deviceId,
      );
      setActiveSpeaker(
        deviceSettings.outputId || devices.speakers[0].deviceId,
      );
      if (deviceSettings.isStartedVideo) {
        localVideo = ZoomVideo.createLocalVideoTrack(
          deviceSettings.cameraId,
        );
        await localVideo?.start(PREVIEW_VIDEO);
      }
      if (!deviceSettings.isMuted) {
        localAudio = ZoomVideo.createLocalAudioTrack(
          deviceSettings.inputId,
        );
        await localAudio?.start();
        await localAudio?.unmute();
        micFeedBackInteval = setInterval(
          () => setMicVolume(localAudio.getCurrentVolume()),
          500,
        );
      }
    });
  }, []);

  useEffect(() => {
    dispatch(setZoomSettings({ ...deviceState }));
  }, [deviceState]);

  return (
    <div className="flex flex-col gap-20 justify-center items-center bg-[#121619] w-full h-screen text-center">
      <div>
        <h1 className="text-white">Waiting to Enter Meeting Room</h1>
        <p className="text-darkGrey">
          Please set up your device first
        </p>
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        {videoRef !== null && (
          <Avatar
            participant={{
              displayName: user.employee.name,
              audio: "computer",
              muted: isMuted,
              bVideoOn: isStartedVideo,
            }}
            isActive={micVolume !== 0}
            style={{
              width: `calc(16*35px)`,
              height: `calc(9*35px)`,
              left: position?.left,
              top: position?.top,
            }}
          />
        )}
        <video
          id="video-preview"
          className="bg-[#444444] w-[calc(16*35px)] h-[calc(9*35px)] rounded-md"
          muted
          data-video="0"
          ref={videoRef}
        />
        <div className="flex justify-evenly px-2 bg-[#1B1F23] h-[95px] w-[400px] rounded-full">
          <div className="flex items-center gap-2">
            <Icon
              icon={switches.mic ? "bi:mic-fill" : "bi:mic-mute-fill"}
              color="#DDE1E6"
              width={25}
            />
            <Switch
              classNames={{
                input:
                  "before:bg-darkGrey before:checked:bg-blue-500 before:border-darkGrey before:checked:border-blue-500 bg-[#1B1F23] border-darkGrey checked:bg-primary3 checked:border-blue-500",
              }}
              checked={switches.mic}
              onChange={(e) => {
                setSwitches({
                  ...switches,
                  mic: e.target.checked,
                });
                onMicrophoneClick(activeMicrophone);
              }}
            />
          </div>

          <div className="flex items-center gap-2 border-[#121619] border-l-2 border-r-2 px-8">
            <Icon
              icon={
                switches.camera
                  ? "bi:camera-video-fill"
                  : "bi:camera-video-off-fill"
              }
              color="#DDE1E6"
              width={25}
            />
            <Switch
              classNames={{
                input:
                  "before:bg-darkGrey before:checked:bg-blue-500 before:border-darkGrey before:checked:border-blue-500 bg-[#1B1F23] border-darkGrey checked:bg-primary3 checked:border-blue-500",
              }}
              checked={switches.camera}
              onChange={(e) => {
                setSwitches({
                  ...switches,
                  camera: e.target.checked,
                });
                onCameraClick(activeCamera);
              }}
            />
          </div>
          <SettingsButton
            cameraList={cameraList}
            microphoneList={micList}
            speakerList={speakerList}
            activeCamera={activeCamera}
            activeMicrophone={activeMicrophone}
            activeSpeaker={activeSpeaker}
            audio="computer"
            withMirrorVideo={false}
            onSwitchCamera={onSwitchCamera}
            onMicrophoneMenuClick={onMicrophoneMenuClick}
          />
        </div>
        <Button
          onClick={onClickJoin}
          color="green"
          size="sm"
          className="font-normal"
          disabled={disabledJoin}
        >
          Join Meeting
        </Button>
      </div>
    </div>
  );
}
