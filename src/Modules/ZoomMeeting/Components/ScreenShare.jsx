import { Icon } from "@iconify/react";

function ScreenShareButton({
  isStartedScreenShare,
  onScreenShareClick,
}) {
  return (
    <button
      type="button"
      className="flex flex-col items-center justify-center text-xs text-green"
      onClick={onScreenShareClick}
    >
      <Icon
        icon={
          isStartedScreenShare
            ? "fluent:share-screen-stop-24-filled"
            : "fluent:share-screen-person-16-filled"
        }
        width={30}
      />
      <span>
        {isStartedScreenShare ? "Stop Share" : "Share Screen"}
      </span>
    </button>
  );
}

function ScreenShareLockButton({
  isLockedScreenShare,
  onScreenShareLockClick,
}) {
  return (
    <button
      type="button"
      className="flex flex-col items-center justify-center text-xs text-green"
      onClick={onScreenShareLockClick}
    >
      <Icon
        icon={
          isLockedScreenShare
            ? "ant-design:lock-outlined"
            : "ant-design:unlock-outlined"
        }
        width={30}
      />
      <span>Share Screen</span>
    </button>
  );
}

export { ScreenShareButton, ScreenShareLockButton };
