import React from "react";

import "./Landing.css";

import Content from "../content/Content";
import Navbar from './../navbar/navbar/Navbar';

export default function Landing() {
  return (
    <div>
      <Navbar />
      <Content/>
    </div>
  );
}