import { List, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <List sx={{ width: 240 }}>
      <ListItemButton onClick={() => navigate("/dashboard")}>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate("/cases/new")}>
        <ListItemText primary="New Patient Case" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate("/history")}>
        <ListItemText primary="History" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate("/dilemmas")}>
        <ListItemText primary="Dilemmas" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate("/analytics")}>
        <ListItemText primary="Analytics / Research" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate("/about")}>
        <ListItemText primary="About / Methodology" />
      </ListItemButton>
    </List>
  );
};

export default Sidebar;
