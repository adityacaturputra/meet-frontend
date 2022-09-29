import { Icon } from "@iconify/react";
import { ActionIcon, Button, Menu } from "@mantine/core";
import { ChatPrivilege } from "@zoom/videosdk";
import { useCallback, useContext } from "react";
import ZoomChatContext from "../../../Contexts/ZoomChatContext";

const meetingChatPrivilegeList = [
  {
    name: "No One",
    value: ChatPrivilege.NoOne,
  },
  {
    name: "Everyone Publicly",
    value: ChatPrivilege.EveryonePublicly,
  },
  {
    name: "Everyone Publicly and Directly",
    value: ChatPrivilege.All,
  },
];
function ChatReceiverContainer({
  chatUsers,
  selectedChatUser,
  chatPrivilege,
  isHostOrManager,
  setChatUser,
}) {
  const chatClient = useContext(ZoomChatContext);
  const onMenuItemClick = useCallback(
    (key) => {
      const userId = Number(key);
      if (userId !== selectedChatUser?.userId) {
        setChatUser(userId);
      }
    },
    [selectedChatUser, setChatUser],
  );
  const onMenuItemPrivilegeClick = useCallback(
    (key) => {
      const privilege = Number(key);
      if (chatPrivilege !== privilege) {
        chatClient?.setPrivilege(privilege);
      }
    },
    [chatPrivilege, chatClient],
  );

  return (
    <div className="flex justify-between items-center border-t pt-2">
      <div className="flex gap-2 items-center">
        <span className="text-sm">To:</span>
        <Menu
          classNames={{ dropdown: "w-[200px]", item: "text-xs" }}
          position="top-start"
        >
          <Menu.Target>
            <Button variant="outline" compact size="xs">
              {selectedChatUser?.displayName}&nbsp;
              <Icon icon="ant-design:caret-down-filled" />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {chatUsers.map((item) => (
              <Menu.Item
                key={item.userId}
                // className={classNames("chat-receiver-item", {
                //   selected: item.userId === selectedChatUser?.userId,
                // })}
                rightSection={
                  item.userId === selectedChatUser?.userId && (
                    <Icon icon="akar-icons:check" />
                  )
                }
                onClick={() => onMenuItemClick(item.userId)}
              >
                {item.displayName}
                {(item.isCoHost || item.isHost) && (
                  <span className="text-darkGrey ml-1">
                    ({item.isHost ? "Host" : "Co-host"})
                  </span>
                )}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </div>
      {isHostOrManager && (
        <Menu
          classNames={{ dropdown: "w-[200px]", item: "text-xs" }}
          position="top-end"
        >
          <Menu.Target>
            <ActionIcon>
              <Icon icon="bi:three-dots" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Participant Can Chat With:</Menu.Label>
            {meetingChatPrivilegeList.map((item) => (
              <Menu.Item
                key={item.value}
                rightSection={
                  item.value === chatPrivilege && (
                    <Icon icon="akar-icons:check" />
                  )
                }
                onClick={() => onMenuItemPrivilegeClick(item.value)}
              >
                {item.name}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      )}
    </div>
  );
}
export default ChatReceiverContainer;
