import { Icon } from "@iconify/react";
import { Menu } from "@mantine/core";
import { Fragment } from "react";

function SettingsButton({
  cameraList,
  microphoneList,
  speakerList,
  activeCamera,
  activeMicrophone,
  activeSpeaker,
  audio,
  withMirrorVideo = true,
  isMirrored,
  onSwitchCamera,
  onMirrorVideo,
  onMicrophoneMenuClick,
}) {
  const menu = [];
  if (cameraList && cameraList.length) {
    menu.push({
      group: "camera",
      title: "Select a camera",
      items: cameraList.map((i) => ({
        label: i.label,
        value: i.deviceId,
        checked: activeCamera === i.deviceId,
      })),
    });
  }
  if (microphoneList && microphoneList.length && audio !== "phone") {
    menu.push({
      group: "microphone",
      title: "Select an input",
      items: microphoneList.map((i) => ({
        label: i.label,
        value: i.deviceId,
        checked: activeMicrophone === i.deviceId,
      })),
    });
  }
  if (speakerList && speakerList.length && audio !== "phone") {
    menu.push({
      group: "speaker",
      title: "Select an output",
      items: speakerList.map((i) => ({
        label: i.label,
        value: i.deviceId,
        checked: activeSpeaker === i.deviceId,
      })),
    });
  }

  if (withMirrorVideo) {
    menu.push({
      items: [
        {
          label: "Mirror Camera",
          value: "mirror",
          checked: isMirrored,
        },
      ],
    });
  }

  const onMenuItemClick = (key) => {
    if (
      key === "leave audio" ||
      key.includes("microphone") ||
      key.includes("speaker")
    ) {
      onMicrophoneMenuClick(key);
    }
    if (key.includes("camera")) {
      const deviceId = key.split("|")[1];
      onSwitchCamera(deviceId);
    }
    if (key === "mirror") {
      onMirrorVideo();
    }
  };

  return (
    <Menu
      classNames={{
        dropdown: "w-[300px] border border-darkGrey",
        item: "flex justify-between",
        itemLabel: "max-w-[240px]",
        label: "text-left",
      }}
      position="top"
    >
      <Menu.Target>
        <button
          type="button"
          className="flex flex-col items-center justify-center"
        >
          <Icon
            icon="ci:settings-filled"
            color="#DDE1E6"
            width={25}
          />
          <p className="cursor-default pointer-events-none text-white/80 text-sm">
            Settings
          </p>
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        {menu.map((e) => {
          if (e.group) {
            const mItem = e.items.map((m) => (
              <Menu.Item
                key={`${e.group}|${m.value}`}
                onClick={() =>
                  onMenuItemClick(`${e.group}|${m.value}`)
                }
                rightSection={
                  m.checked && <Icon icon="akar-icons:check" />
                }
              >
                {m.label}
              </Menu.Item>
            ));
            return (
              <Fragment key={e.group}>
                <Menu.Label>{e.title}</Menu.Label>
                {mItem}
                <Menu.Divider key={`${e.group}-divider`} />
              </Fragment>
            );
          }
          return e.items.map((m) => (
            <Menu.Item
              key={m?.value}
              onClick={() => onMenuItemClick(m?.value)}
              rightSection={
                m?.checked && <Icon icon="akar-icons:check" />
              }
            >
              {m?.label}
            </Menu.Item>
          ));
        })}
      </Menu.Dropdown>
    </Menu>
  );
}
export default SettingsButton;
