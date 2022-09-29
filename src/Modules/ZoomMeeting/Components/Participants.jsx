import { Icon } from "@iconify/react";
import { Modal } from "@mantine/core";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ZoomContext from "../../../Contexts/ZoomContext";

function ParticipantsButton() {
  const zmClient = useContext(ZoomContext);
  const userId = useMemo(async () => {
    const user = await zmClient.getCurrentUserInfo();
    return user.userId;
  }, [zmClient]);
  const [isOpen, setIsOpen] = useState(false);
  const [participants, setParticipants] = useState([]);

  const onParticipantsUpdated = useCallback(async () => {
    const list = await zmClient.getAllUser();
    setParticipants(list);
  }, [zmClient]);

  useEffect(() => {
    zmClient.on("user-added", onParticipantsUpdated);
    zmClient.on("user-updated", onParticipantsUpdated);
    zmClient.on("user-removed", onParticipantsUpdated);
    return () => {
      zmClient.off("user-added", onParticipantsUpdated);
      zmClient.off("user-updated", onParticipantsUpdated);
      zmClient.off("user-removed", onParticipantsUpdated);
    };
  }, [zmClient, onParticipantsUpdated]);

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
        title="Participants"
      >
        <div className="flex flex-col gap-3">
          {participants.map((participant) => {
            return (
              <div
                key={participant.userId}
                className="flex justify-between items-center"
              >
                <div className="flex gap-2 items-center">
                  <img
                    src={participant?.avatar}
                    alt={participant?.displayName}
                    className="w-[25px] h-[25px] rounded-md"
                  />
                  <span>{participant?.displayName}</span>
                  {participant?.userId === userId && (
                    <span className="text-primary1">(Me)</span>
                  )}
                </div>
                <div className="flex gap-3 items-center text-darkGrey">
                  {participant?.bVideoOn && (
                    <Icon icon="bi:camera-video-fill" />
                  )}
                  <Icon
                    icon={
                      participant?.muted ? "bi:mic-mute" : "bi:mic"
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <button
        type="button"
        className="flex flex-col items-center justify-center text-xs"
        onClick={() => setIsOpen(true)}
      >
        <Icon icon="heroicons-solid:users" width={30} />
        <span>Participants</span>
      </button>
    </>
  );
}

export default ParticipantsButton;
