/* eslint-disable no-nested-ternary */
import { Icon } from "@iconify/react";

function MicrophoneButton({
  isStartedAudio,
  isMuted,
  audio,
  onMicrophoneClick,
}) {
  return (
    <button
      type="button"
      className="flex flex-col items-center justify-center text-xs"
      onClick={onMicrophoneClick}
    >
      {(() => {
        if (isStartedAudio) {
          if (isMuted) {
            return (
              <Icon
                icon={
                  audio === "phone"
                    ? "ant-design:phone-outlined"
                    : "bi:mic-mute"
                }
                width={30}
              />
            );
          }
          return (
            <Icon
              icon={
                audio === "phone"
                  ? "ant-design:phone-filled"
                  : "bi:mic"
              }
              width={30}
            />
          );
        }
        return <Icon icon="bi:headset" width={30} />;
      })()}
      {!isStartedAudio ? (
        <span>Join audio</span>
      ) : (
        <span>{isMuted ? "Unmute" : "Mute"}</span>
      )}
    </button>
  );
}

export default MicrophoneButton;
