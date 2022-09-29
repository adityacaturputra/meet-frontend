import { Icon } from "@iconify/react";
import { RecordingStatus } from "@zoom/videosdk";

export const recordStatusIcon = {
  text: "Status",
  tipText: "Record Status",
  icon: "icon-recording-animated",
  color: "red",
};

export const getRecordingButtons = (status, isHost) => {
  // Stopped = recording
  // Recording = pause recording/ stop recording
  // Paused = resume recording/ stop recording
  let buttons = [];

  if (status === RecordingStatus.Stopped || status === "") {
    buttons = [
      {
        text: "Record",
        tipText: "Start recording",
        icon: "fluent:record-32-regular",
        color: "text-red-500",
      },
    ];
  } else if (status === RecordingStatus.Recording) {
    if (!isHost) return [recordStatusIcon];
    buttons = [
      recordStatusIcon,
      {
        text: "Pause",
        tipText: "Pause recording",
        icon: "clarity:pause-solid",
        color: "text-white/75",
      },
      {
        text: "Stop",
        tipText: "Stop recording",
        icon: "carbon:stop-filled-alt",
        color: "text-white/75",
      },
    ];
  } else if (status === RecordingStatus.Paused) {
    if (!isHost) return [recordStatusIcon];
    buttons = [
      recordStatusIcon,
      {
        text: "Resume",
        tipText: "Resume recording",
        icon: "carbon:play-filled-alt",
        color: "text-white/75",
      },
      {
        text: "Stop",
        tipText: "Stop recording",
        icon: "carbon:stop-filled-alt",
        color: "text-white/75",
      },
    ];
  }
  return buttons;
};

function RecordingButton({ tipText, icon, color, onClick }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center text-xs ${color}`}
      onClick={onClick}
    >
      <Icon icon={icon} width={30} className={color} />
      <span>{tipText}</span>
    </button>
  );
}

export { RecordingButton };
