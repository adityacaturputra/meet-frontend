import { Textarea } from "@mantine/core";
import { ChatPrivilege } from "@zoom/videosdk";
import { useCallback, useContext, useEffect, useState } from "react";
import ZoomChatContext from "../../../Contexts/ZoomChatContext";
import ZoomContext from "../../../Contexts/ZoomContext";
import { useParticipantsChange } from "../Hooks/useParticipantsChange";
import ChatMessageItem from "./ChatMessageItem";
import ChatReceiverContainer from "./ChatReceiver";

function ChatContainer({ chatRecords, chatWrapRef }) {
  const zmClient = useContext(ZoomContext);
  const chatClient = useContext(ZoomChatContext);
  const [currentUserId, setCurrentUserId] = useState(0);
  const [chatReceivers, setChatReceivers] = useState([]);
  const [chatPrivilege, setChatPrivilege] = useState(
    ChatPrivilege.All,
  );
  const [chatUser, setChatUser] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [chatDraft, setChatDraft] = useState("");

  const onChatPrivilegeChange = useCallback(
    (payload) => {
      setChatPrivilege(payload.chatPrivilege);
      if (chatClient) {
        setChatReceivers(chatClient.getReceivers());
      }
    },
    [chatClient],
  );
  const onChatInput = useCallback((event) => {
    setChatDraft(event.target.value);
  }, []);

  useEffect(() => {
    zmClient.on("chat-privilege-change", onChatPrivilegeChange);
    return () => {
      zmClient.off("chat-privilege-change", onChatPrivilegeChange);
    };
  }, [zmClient, onChatPrivilegeChange]);
  useParticipantsChange(zmClient, () => {
    if (chatClient) {
      setChatReceivers(chatClient.getReceivers());
    }
    setIsHost(zmClient.isHost());
    // setIsManager(zmClient.isManager());
  });
  useEffect(() => {
    if (chatUser) {
      const index = chatReceivers.findIndex(
        (user) => user.userId === chatUser.userId,
      );
      if (index === -1) {
        setChatUser(chatReceivers[0]);
      }
    } else if (chatReceivers.length > 0) {
      setChatUser(chatReceivers[0]);
    }
  }, [chatReceivers, chatUser]);
  const setChatUserId = useCallback(
    (userId) => {
      const user = chatReceivers.find((u) => u.userId === userId);
      if (user) {
        setChatUser(user);
      }
    },
    [chatReceivers],
  );
  const sendMessage = useCallback(
    (event) => {
      if (event.keyCode === 13 && chatUser && chatDraft) {
        event.preventDefault();
        chatClient?.send(chatDraft, chatUser?.userId);
        setChatDraft("");
      }
    },
    [chatClient, chatDraft, chatUser],
  );
  useEffect(() => {
    setCurrentUserId(zmClient.getSessionInfo().userId);
    if (chatClient) {
      setChatPrivilege(chatClient.getPrivilege());
    }
  }, []);

  return (
    <div className="w-full bg-white flex flex-col rounded-2xl">
      <div
        className="flex-grow overflow-y-auto border-b-darkGrey h-[300px]"
        ref={chatWrapRef}
      >
        {chatRecords.map((record) => (
          <ChatMessageItem
            record={record}
            currentUserId={currentUserId}
            setChatUser={setChatUserId}
            key={record.timestamp}
          />
        ))}
      </div>
      {ChatPrivilege.NoOne !== chatPrivilege ||
      isHost ||
      isManager ? (
        <div className="flex flex-col gap-3">
          <ChatReceiverContainer
            chatUsers={chatReceivers}
            selectedChatUser={chatUser}
            isHostOrManager={isHost || isManager}
            chatPrivilege={chatPrivilege}
            setChatUser={setChatUserId}
          />
          <Textarea
            onKeyDown={sendMessage}
            onChange={onChatInput}
            value={chatDraft}
            placeholder="Type message here ..."
          />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-shrink-0 text-darkGrey">
          Chat disabled
        </div>
      )}
    </div>
  );
}

export default ChatContainer;
