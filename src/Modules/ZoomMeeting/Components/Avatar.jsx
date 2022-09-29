import { Icon } from "@iconify/react";
import React from "react";

function Avatar({ participant, style, isActive, className }) {
  const { displayName, audio, muted, bVideoOn } = participant;
  const splittedDisplayName = displayName.trim().split(" ");
  return (
    <div
      className={`absolute flex justify-center items-center rounded-md ${
        isActive ? "border-[3px] border-primary1" : ""
      } ${className || ""}`}
      style={{
        ...style,
        background: bVideoOn ? "transparent" : "rgb(26,26,26)",
      }}
    >
      {/* {(bVideoOn || (audio === "computer" && muted)) && ( */}
      <div className="absolute bg-black/30 rounded-bl-md left-0 bottom-0 flex py-4 px-3 items-center max-w-full h-[25px] text-sm">
        {audio === "computer" && muted && (
          <Icon
            icon="bi:mic-mute"
            color="#f00"
            className="mr-[5px]"
          />
        )}
        {audio === "" && (
          <Icon icon="bi:headset" color="#f00" className="mr-[5px]" />
        )}
        <span className="text-white">{displayName}</span>
      </div>
      {/* )} */}
      {!bVideoOn && (
        <div className="bg-white h-[80px] w-[80px] rounded-full p-5">
          <p className="m-auto text-center text-primary1 font-semibold text-3xl">
            {splittedDisplayName[0][0]}
            {splittedDisplayName.length > 1 &&
              splittedDisplayName[splittedDisplayName.length - 1][0]}
          </p>
        </div>
      )}
    </div>
  );
}

export default Avatar;
