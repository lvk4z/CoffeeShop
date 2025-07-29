import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFullHostName, getNextSunday } from "../utils/utils";

const formatTime = (value) => value.toString().padStart(2, "0");

const NextMeetingInfo = ({ target }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const dispatch = useDispatch();
  const host = "Zegarów nr 17"; //getFullHostName(useSelector((state) => state.user.host));

  useEffect(() => {
    const targetDate = getNextSunday(false);

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft("Spotkanie już trwa!");
        return;
      }

      const days = formatTime(Math.floor(diff / (1000 * 60 * 60 * 24)));
      const hours = formatTime(Math.floor((diff / (1000 * 60 * 60)) % 24));
      const minutes = formatTime(Math.floor((diff / (1000 * 60)) % 60));
      const seconds = formatTime(Math.floor((diff / 1000) % 60));

      setTimeLeft(`${days}:${hours}:${minutes}:${seconds}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span>
      Następne spotkanie u {host} za {timeLeft}
    </span>
  );
};

export default NextMeetingInfo;
