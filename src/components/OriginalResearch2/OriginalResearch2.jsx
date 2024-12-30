import React from "react";

import CustomSearch from "../CustomComponents/CustomSearch/CustomSearch";
import "../../css/SwiftFoliosReserch/SwiftFoliosResearch.css";

import download from "../../assets/icons/download_icon.svg";

const OriginalResearch2 = ({ fundData }) => {
  console.log("fundData", fundData);

  const fundRowData = [
    {
      name: "RELIANCE",
      price: "1,452.32",
      val_change: "145.36",
      per_change: "9.62%",
    },
    {
      name: "RELIANCE",
      price: "1,452.32",
      val_change: "145.36",
      per_change: "9.62%",
    },
    {
      name: "RELIANCE",
      price: "1,452.32",
      val_change: "145.36",
      per_change: "9.62%",
    },
  ];

  return (
    <div className="swift-folios-research-main">
      <div className="swift-folios-research-main-header-container">
        <p className="swift-folios-research-main-header">
          Original Research- SwiftResearch
        </p>
       <CustomSearch/>
      </div>
      {fundData.map((data, index) => (
        <div
          key={index}
          className={
            !data.video
              ? "swift-folios-research-container"
              : "swift-folios-research-container-with-video"
          }
        >
          <div className="swift-folios-research-sub-container">
            <div className="swift-folios-research-row1">
              <div className="swift-folios-research-fund-name">{data.name}</div>
              <div className="swift-folios-research-fund-price">
                {data.price}
              </div>
              <div className="swift-folios-research-value-change">
                {data.value_change}
              </div>
              <div className="swift-folios-research-per-change">
                {data.perc_change}
              </div>
            </div>
            <div className="swift-folios-research-row2">
              <div className="swift-folios-research-row2-header">
                {data.header}
              </div>
              <div className="swift-folios-research-row2-text">{data.text}</div>
              <div className="swift-folios-research-row2-date">{data.date}</div>
            </div>
            <div className="swift-folios-research-row3">
              {fundRowData.map((row, idx) => (
                <div
                  className="swift-folios-research-row3-container"
                  key={idx}
                >
                  <div className="swift-folios-research-fund-name">
                    {row.name}
                  </div>
                  <div className="swift-folios-research-fund-price">
                    Rs.{row.price}
                  </div>
                  <div className="swift-folios-research-fund-change-container">
                    <div className="swift-folios-research-value-change">
                      {row.val_change}
                    </div>
                    <div className="swift-folios-research-per-change">
                      {row.per_change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="swift-folios-research-file-container">
              <div className="swift-folios-research-file">
                <img src={download} alt="file preview" />
              </div>
              <a
                href="file.pdf"
                download="filename.pdf"
                className="swift-folios-research-file-download-button"
              >
                Download
              </a>
            </div>
          </div>
          {data.video && (
            <video controls width="300">
              <source src={data.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      ))}
    </div>
  );
};

export default OriginalResearch2;
