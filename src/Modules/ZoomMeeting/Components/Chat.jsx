import { Icon } from "@iconify/react";
import { Modal } from "@mantine/core";
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ZoomContext from "../../../Contexts/ZoomContext";
import ChatContainer from "./ChatContainer";

function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatRecords, setChatRecords] = useState([]);
  const zmClient = useContext(ZoomContext);
  const chatWrapRef = useRef(null);
  const onChatMessage = useCallback(
    (payload) => {
      setChatRecords((records) => {
        const { length } = records;
        const newRecords = [...records];
        if (length > 0) {
          const lastRecord = records[length - 1];
          if (
            payload.sender.userId === lastRecord.sender.userId &&
            payload.receiver.userId === lastRecord.receiver.userId &&
            payload.timestamp - lastRecord.timestamp < 1000 * 60 * 5
          ) {
            if (Array.isArray(lastRecord.message)) {
              newRecords[length - 1] = {
                ...lastRecord,
                message: [...lastRecord.message, payload.message],
              };
            } else {
              newRecords[length - 1] = {
                ...lastRecord,
                message: [lastRecord.message, payload.message],
              };
            }
            return newRecords;
          }
          newRecords.push(payload);
          return newRecords;
        }
        newRecords.push(payload);
        return newRecords;
      });
      if (chatWrapRef.current) {
        chatWrapRef.current.scrollTo(
          0,
          chatWrapRef.current.scrollHeight,
        );
      }
    },
    [chatWrapRef],
  );

  useEffect(() => {
    zmClient.on("chat-on-message", onChatMessage);
    return () => {
      zmClient.off("chat-on-message", onChatMessage);
    };
  }, [zmClient, onChatMessage]);

  return (
    <>
      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        withCloseButton
        classNames={{
          title: "font-semibold",
          modal: "w-[400px]",
          body: "p-0",
        }}
        overlayOpacity={0}
        centered
        title="Chat"
      >
        <ChatContainer
          chatRecords={chatRecords}
          setChatRecords={setChatRecords}
          chatWrapRef={chatWrapRef}
        />
      </Modal>
      <button
        type="button"
        className="flex flex-col items-center justify-center text-xs"
        onClick={() => setIsOpen(true)}
      >
        <Icon icon="eva:message-square-fill" width={30} />
        <span>Chat</span>
      </button>
    </>
  );
}

export default ChatButton;
