import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Chip, Paper, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CreateMeetingPage from "./CreateMeetingPage";
import Menu from "./Menu";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeeting } from "../redux/features/meetingSlice";
import axiosInstance from "../utils/axiosInstance";

const HOST_NAMES = {
  M: "Miczki – nr 17f",
  Z: "Zegarowie – nr 17",
  S: "Staszkowie – nr 17a",
  K: "Krakowscy – nr 136a",
};

const STATUS_LABELS = {
  PL: { label: "Zaplanowane", color: "success" },
  PO: { label: "Przełożone", color: "warning" },
  TP: { label: "Odbyło się", color: "default" },
};

const Meeting = () => {
  const dispatch = useDispatch();
  const meetingID = useSelector((state) => state.meeting.meetingID);
  const currentUser = useSelector((state) => state.auth.user);
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    dispatch(fetchMeeting());
  }, [dispatch]);

  useEffect(() => {
    if (meetingID) {
      axiosInstance
        .get(`/get-meeting/?id=${meetingID}`)
        .then((res) => setMeetingDetails(res.data))
        .catch((err) => console.error("Error fetching meeting:", err));
    }
  }, [meetingID]);

  if (!meetingDetails) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const statusInfo = STATUS_LABELS[meetingDetails.status] || { label: meetingDetails.status, color: "default" };
  const isHost = currentUser?.house === meetingDetails.host;

  return (
    <Box sx={{ pt: { xs: "76px", sm: "84px", md: "92px" }, pb: 4, px: { xs: 2, sm: 3 } }}>
      {/* Meeting info card */}
      <Paper
        elevation={0}
        sx={{
          maxWidth: 700,
          mx: "auto",
          mb: 4,
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {HOST_NAMES[meetingDetails.host] || meetingDetails.host}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {new Date(meetingDetails.event_date).toLocaleDateString("pl-PL", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          {isHost && !showSettings && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<SettingsOutlinedIcon />}
              onClick={() => setShowSettings(true)}
              sx={{ borderColor: "divider", color: "text.secondary" }}
            >
              Edytuj
            </Button>
          )}
        </Box>
      </Paper>

      {showSettings ? (
        <Box sx={{ maxWidth: 700, mx: "auto" }}>
          <CreateMeetingPage
            pUpdate
            pDate={meetingDetails.event_date?.slice(0, 10)}
            pStatus={meetingDetails.status}
            pHost={meetingDetails.host}
            pUpdateCallback={() => setShowSettings(false)}
            pID={meetingID}
          />
          <Button
            variant="text"
            onClick={() => setShowSettings(false)}
            sx={{ mt: 2, color: "text.secondary" }}
          >
            Anuluj
          </Button>
        </Box>
      ) : (
        <Menu />
      )}
    </Box>
  );
};

export default Meeting;

