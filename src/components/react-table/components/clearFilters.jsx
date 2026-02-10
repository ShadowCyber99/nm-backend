import React from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { IconButton } from "@mui/material";
const ClearFilters = ({ column }) => {
  return (
    <IconButton  style={{ backgroundColor: "#5C6878" }}>
      <CloseOutlinedIcon fontSize="small" color="secondary" />
    </IconButton>
  );
};

export default ClearFilters;
