import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getNextSunday } from "../utils/utils";

const pad = (v) => String(v).padStart(2, "0");

const HOST_NAMES = {
  M: "Miczków",
  Z: "Zegarów",
  S: "Staszków",
  K: "Krakowskich",
};

const NextMeetingInfo = () => {
  const [timeLeft, setTimeLeft] = useState("");
  const meetingID = useSelector((state) => state.meeting.meetingID);
  // We show a generic countdown to next Sunday — precise host shown in Meeting page

  useEffect(() => {
    const target = getNextSunday(false);
    const tick = () => {
      const diff = target - new Date();
      if (diff <= 0) { setTimeLeft("Spotkanie już trwa!"); return; }
      const d = pad(Math.floor(diff / 864e5));
      const h = pad(Math.floor((diff / 36e5) % 24));
      const m = pad(Math.floor((diff / 6e4) % 60));
      const s = pad(Math.floor((diff / 1e3) % 60));
      setTimeLeft(`${d}d ${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>
      Następne spotkanie za {timeLeft}
    </span>
  );
};

export default NextMeetingInfo;
