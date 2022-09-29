import { Button } from "@mantine/core";
import { useLocation } from "react-router-dom";
import MeetingSvg from "../../../Components/Assets/Icon/Meeting";

export default function MeetFinished() {
  const { state } = useLocation();
  return (
    <div className="min-h-screen flex flex-col gap-10 items-center justify-center">
      <MeetingSvg />
      <h1 className="font-semibold text-4xl mb-14">
        {state?.message || "Meeting ended"}
      </h1>
      <a href={`${import.meta.env.VITE_KMS_URL}/home`}>
        <Button variant="outline">Back to Home</Button>
      </a>
    </div>
  );
}
