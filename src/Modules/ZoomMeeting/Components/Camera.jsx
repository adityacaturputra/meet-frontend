import { Icon } from "@iconify/react";

function CameraButton({ isStartedVideo, onCameraClick }) {
  return (
    <button
      type="button"
      className="flex flex-col items-center justify-center text-xs"
      onClick={onCameraClick}
    >
      <Icon
        icon={
          !isStartedVideo
            ? "bi:camera-video-off-fill"
            : "bi:camera-video-fill"
        }
        width={30}
      />
      <span>{isStartedVideo ? "Stop camera" : "Start camera"}</span>
    </button>
  );
}
export default CameraButton;
