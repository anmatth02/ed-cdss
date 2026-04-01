import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AppLayout = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
        <Sidebar />

        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "#f1f1f1",
            width: "100%",
            minWidth: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
