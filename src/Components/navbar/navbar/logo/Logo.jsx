
import React from "react";
import logoimg from "../../../../images/logo.png"
import "./Logo.css";

export default function Logo() {
  return (
    <div className="logo hoverable">
      <img src={logoimg} />
      <span>Idea Hub</span>
    </div>
  );
}
