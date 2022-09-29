import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import { Fragment } from "react";

export default function ModalLayout1({
  state,
  children,
  height = "h-[80vh]",
}) {
  return (
    <Transition appear show={state} as={Fragment}>
      <Dialog
        as="div"
        tabIndex={0}
        className="fixed inset-0 z-10 overflow-y-auto bg-gray-900/10"
        onClose={() => true}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={`inline-block overflow-hidden text-left align-middle transition-all transform bg-white shadow-md w-[90vw] md:w-[60vw] ${height} md-[50vh] rounded-lg`}
            >
              <div className="grid grid-template-rows h-full">
                {children}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

ModalLayout1.propTypes = {
  state: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  height: PropTypes.string,
};

ModalLayout1.defaultProps = {
  height: "h-[80bh]",
};
