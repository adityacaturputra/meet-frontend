import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Dialog } from "@mantine/core";

const SuccessHandling = NiceModal.create(({ message }) => {
  const modal = useModal("success-handling-dialog");

  return (
    <Dialog
      opened={modal.visible}
      withCloseButton
      onClose={modal.hide}
      position={{ bottom: 20, left: 75 }}
      transition="slide-up"
      transitionDuration={250}
      classNames={{
        root: "flex items-center gap-4",
        closeButton: "my-1",
      }}
    >
      {/* <Icon icon="bx:error-circle" color="green" /> */}
      <div className="flex flex-col">
        <span className="text-sm mr-5 text-green">{message}</span>
      </div>
    </Dialog>
  );
});

export default SuccessHandling;
