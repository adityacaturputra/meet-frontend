/* eslint-disable jsx-a11y/anchor-is-valid */
import { Icon } from "@iconify/react";

import { useCallback } from "react";

function ChatMessageItem({ record, currentUserId, setChatUser }) {
  const { message, sender, receiver, timestamp } = record;
  const { avatar } = sender;
  const isCurrentUser = currentUserId === sender.userId;
  const onAvatarClick = useCallback(() => {
    if (!isCurrentUser) {
      setChatUser(sender.userId);
    }
  }, [isCurrentUser, sender, setChatUser]);
  const chatMessage = Array.isArray(message) ? message : [message];
  return (
    <div
      className={`flex gap-2 justify-between mb-4 px-5 py-1 ${
        isCurrentUser ? "flex-row-reverse" : ""
      }`}
    >
      <button
        type="button"
        className="self-start"
        onClick={onAvatarClick}
      >
        {avatar ? (
          <img
            src={avatar}
            className="w-[30px] h-[30px] rounded-full border-2"
            alt=""
          />
        ) : (
          <Icon icon="carbon:user-avatar" width={30} height={30} />
        )}
      </button>
      <div className="flex-grow">
        <div
          className={`flex justify-between items-center text-sm ${
            isCurrentUser ? "flex-row-reverse" : ""
          }`}
        >
          <p className="flex gap-1 text-right">
            {isCurrentUser ? "" : sender.name}
            <span className="text-darkGrey">to</span>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setChatUser(receiver.userId);
              }}
              className="text-primary1"
            >
              {receiver.userId === currentUserId
                ? "Me"
                : receiver.name}
            </a>
          </p>
          <p className="max-w-[100px] text-darkGrey">
            {new Date(timestamp).toLocaleTimeString()}
          </p>
        </div>
        <ul
          className={`flex flex-col mt-1 ${
            isCurrentUser ? "items-end" : "items-start"
          }`}
        >
          {chatMessage.map((text, index) => (
            <li
              className={`py-2 px-3 rounded-md text-sm mb-2 ${
                isCurrentUser ? "bg-[#d6fff6]" : "bg-bg2"
              }`}
              key={index}
            >
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default ChatMessageItem;
