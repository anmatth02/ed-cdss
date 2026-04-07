import { List, ListItemButton, ListItemText } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "New Patient Case", path: "/cases/new" },
    { label: "History", path: "/history" },
  ];

  return (
    <List sx={{ width: 240, p: 1 }}>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <ListItemButton
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              mb: 1,
              borderRadius: 2,
              backgroundColor: isActive ? "#ede7f6" : "transparent",
              borderLeft: isActive ? "4px solid #5e35b1" : "4px solid transparent",
              color: isActive ? "#4527a0" : "#1f1f1f",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: isActive ? "#e6ddf5" : "#f5f5f5",
              },
            }}
          >
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: isActive ? "bold" : "normal",
              }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
};

export default Sidebar;