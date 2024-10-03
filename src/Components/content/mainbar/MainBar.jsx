import React from "react";

import CloseIcon from '@mui/icons-material/Close';
import "./MainBar.css";
import Whatshot from "@mui/icons-material/Whatshot";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Menu from '@mui/material/Menu';
import Posts from "../post/Post";
import NewReleases from "@mui/icons-material/NewReleases";
import TrendingUp from "@mui/icons-material/TrendingUp";
import MoreHoriz from "@mui/icons-material/MoreHoriz";


export default function MainBar() {
  return (
    <div className="main-bar">
      <div className="update-card">
        <div className="top-section">
          <span>UPDATES FROM REDDIT</span>
          <CloseIcon className="hoverable" />
        </div>
        <div className="body hoverable">
          <div className="context">
            <span className="title">Keep yourself safe and informed</span>
            <br />
            <span className="description">Visit r/Coronavirus to talk about COVID-19, and visit www.who.int for more information.</span>
          </div>
          {/* <img src="" />  revelent image */}
        </div>
      </div>

      <div className="filter-container">
        <div className="filter-element hoverable">
          <Whatshot />
          <span>Hot</span>
        </div>
        <div className="filter-element hoverable">
          <span>Everywhere</span>
          <ArrowDropDown />
        </div>
        <div className="filter-element-secondary hoverable">
          <NewReleases />
          <span>New</span>
        </div>
        <div className="filter-element-secondary hoverable">
          <TrendingUp />
          <span>Top</span>
        </div>
        <MoreHoriz className="filter-element-tertiary hoverable" />
        <div className="spacer"></div>
        <div className="filter-element-menu hoverable">
          <Menu />
          <ArrowDropDown />
        </div>
      </div>

      <Posts />
    </div>
  );
}