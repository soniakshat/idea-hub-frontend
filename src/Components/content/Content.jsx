import React from "react";

import "./Content.css";
import SideBar from './sidebar/SideBar';
import MainBar from './mainbar/MainBar';




export default function Content() {
  return (
    <div className="content">
      
      <div className="bars-wrapper">
        <span className="popular-posts-title">Popular posts</span>
        <div className="bars-wrapper-inside">
          <MainBar />
          <SideBar /> 
        </div>
      </div>
    </div>
  );
}