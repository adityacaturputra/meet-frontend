import { useCallback, useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ZoomContext from "../../../Contexts/ZoomContext";
import generateVideoToken from "../../../Utils/Helpers/generateVideoToken";
import getUserCookie from "../../../Utils/Helpers/getUserCookie";
import ZoomMeeting from "./ZoomMeeting";
import ZoomPreview from "./ZoomPreview";

export default function MeetLandingPage() {
  const user = getUserCookie();
  if (!user) {
    return window.location.replace(`${import.meta.env.VITE_SSO_URL}`);
  }

  const [searchParams] = useSearchParams();
  const state = {
    topic: searchParams.get("t"),
    hostId: parseInt(searchParams.get("h"), 10),
    password: searchParams.get("p"),
    sessionKey: searchParams.get("s"),
  };

  if (!state?.password) {
    return window.location.replace(
      `${import.meta.env.VITE_KMS_URL}/home`,
    );
  }

  const zmClient = useContext(ZoomContext);
  const [status, setStatus] = useState("closed");
  const [isLoading, setIsLoading] = useState(false);
  const meetingData = useMemo(() => {
    return {
      topic: state?.topic,
      token: generateVideoToken(
        state?.topic,
        state?.password,
        state?.sessionKey,
        user.email,
        user.employee.employee_id === state?.hostId ? 1 : 0,
      ),
      userName: user.employee.name,
      password: state?.password,

      // topic: `test`,
      // token: generateVideoToken(
      //   `test`,
      //   "123",
      //   "123sessionkey",
      //   "a@b.com",
      //   1,
      // ),
      // userName: "test user",
      // password: "123",
    };
  }, [user, state]);
  const onLeaveOrJoinSession = useCallback(async () => {
    if (status === "closed") {
      setIsLoading(true);
      setStatus("connecting");
    } else if (status === "connected") {
      setStatus("closed");
      await zmClient.leave();
    }
  }, [zmClient, status, meetingData]);

  return (
    <div className="justify-center">
      {status === "closed" ? (
        <ZoomPreview
          onClickJoin={onLeaveOrJoinSession}
          disabledJoin={
            typeof user === "undefined" ||
            typeof state === "undefined" ||
            status === "connecting" ||
            isLoading
          }
        />
      ) : (
        <ZoomMeeting
          status={status}
          setStatus={setStatus}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          meetingData={meetingData}
        />
      )}
    </div>
  );
}
