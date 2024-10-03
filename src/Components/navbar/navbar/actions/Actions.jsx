import React from "react";
import "./Actions.css";
import Button from "../../../button/Button"; 
import PersonIcon from "@mui/icons-material/Person";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";


export default function Actions() {
  return (
    <div className="actions">
      <Button secondary label="LOG IN" />
      <Button  label="SIGN UP" />
      <div className="profile">
        <PersonIcon className="hoverable" />
        <ArrowDropDownIcon className="hoverable" />
      </div>
    </div>
  );
}