import { Icon } from "@iconify/react";
import { Modal } from "@mantine/core";
import PropTypes from "prop-types";

export default function ModalLayout2({
  title,
  isOpen,
  onClose,
  body,
}) {
  return (
    <Modal
      size="50%"
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
      closeOnClickOutside={false}
      padding={0}
      overlayOpacity={0.1}
      centered
      classNames={{ modal: "rounded-lg max-h-max" }}
    >
      <div className="flex justify-between items-center py-3 border-b border-grey2 w-full">
        <span className="text-lg font-medium ml-7">{title}</span>
        <button type="button" onClick={onClose} className="mr-4">
          <Icon icon="bi:x" width={36} color="#878D96" />
        </button>
      </div>

      {body}
    </Modal>
  );
}

ModalLayout2.propTypes = {
  onClose: PropTypes.func.isRequired,
  body: PropTypes.element,
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

ModalLayout2.defaultProps = {
  body: undefined,
};
