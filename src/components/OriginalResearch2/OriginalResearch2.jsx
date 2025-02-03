import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import CustomSearch from "../CustomComponents/CustomSearch/CustomSearch";
import "../../css/SwiftFoliosReserch/SwiftFoliosResearch.css";
import OriginalResearch2HorizontalDisplay from "./OriginalResearch2HorizontalDisplay";
import OriginalResearch2Main from "./OriginalResearch2Main";
import OriginalResearch2VerticalDisplay from "./OriginalResearch2VerticalDisplay";
import Pulse from "../CustomComponents/Loader/Pulse";
import ServerRequest from "../../utils/ServerRequest";
import download from "../../assets/icons/download_icon.svg";
import moment from "moment";

import downArrow from "../../assets/icons/down_arrow.svg";

const OriginalResearch2 = ({ fundData }) => {
  const accountCode = "BRC4897812";
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visitedItems, setVisitedItems] = useState(new Set());
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ServerRequest({
          method: "get",
          URL: "/swift-folios-research/form-data/get",
        });
        const normalizedData = data?.data?.map((item) => ({
          ...item,
          related_stock: item.related_stock
            ? JSON.parse(item.related_stock)
            : [],
        }));

        const visitedData = await ServerRequest({
          method: "get",
          URL: "/swift-folios-research/visit-status/get",
        });

        const visitedIds = visitedData?.data
          .filter(
            (item) =>
              item.account_id === accountCode && item.visit_status === "1"
          )
          .map((item) => item.id);

        setVisitedItems(new Set(visitedIds));
        setAllData(normalizedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleVisitStatus = async (index, itemId) => {
    const data = {
      account_code: accountCode,
      item_id: itemId,
      visit_status: true,
    };
    try {
      await ServerRequest({
        method: "post",
        URL: "/swift-folios-research/visit-status/post",
        data: data,
      });
      setVisitedItems((prevVisited) => {
        const updated = new Set(prevVisited);
        updated.add(itemId);
        return updated;
      });
      console.log("Visit status updated successfully");
    } catch (error) {
      console.error("Error updating visit status:", error);
    }
  };

  const handleToggleExpand = (itemId) => {
    setExpandedItems((prevExpanded) => {
      const updated = new Set(prevExpanded);
      if (updated.has(itemId)) {
        updated.delete(itemId);
      } else {
        updated.add(itemId);
      }
      return updated;
    });
  };

  const handleFileDownload = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("File not found or inaccessible");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileUrl.split("/").pop();
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  // if (loading == false){
  //   console.log("thurl",allData[3].thumbnail_url);

  // }
  // console.log("data",allData);

  return loading ? (
    <div className="swift-folios-research-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  ) : allData?.length === 0 ? (
    <div className="no-data-container">
      <p>No Data Available</p>
    </div>
  ) : (
    <div className="swift-folios-research-main">
      <div className="swift-folios-research-main-header-container">
        <p className="swift-folios-research-main-header">
          Original Research- SwiftResearch
        </p>
        <CustomSearch />
      </div>
      {allData?.map((data, index) => (
        <div
          key={index}
          className={
            !data.video_url
              ? "swift-folios-research-container"
              : "swift-folios-research-container-with-video"
          }
          onClick={() => handleVisitStatus(index, data.id)}
          style={{
            backgroundColor: visitedItems.has(data.id)
              ? "transparent"
              : "#FAFAFA",
          }}
        >
          <div className="swift-folios-research-sub-container">
            <OriginalResearch2HorizontalDisplay stockCode={data.stock_code} />
            <OriginalResearch2Main
              heading={data.heading}
              body={
                expandedItems.has(data.id)
                  ? data.description
                  : data.description.length > 150
                  ? data.description.slice(0, 140) + "  ..."
                  : data.description
              }
              date={moment(data.date).format("Do MMMM YYYY")}
            />

            <div className="swift-folios-research-row3">
              {data?.related_stock?.map((stock, idx) => (
                <OriginalResearch2VerticalDisplay key={idx} stockCode={stock} />
              ))}
            </div>

            {data.file_url && (
              <div className="swift-folios-research-file-container">
                <div className="swift-folios-research-file">
                  <img src={download} alt="file preview" />
                </div>
                <button
                  onClick={() => handleFileDownload(data.file_url)}
                  className="swift-folios-research-file-download-button"
                >
                  Download
                </button>
              </div>
            )}
            {data.description.length > 150 && (
              <div className="read-full-button-group">
                <img
                  onClick={() => handleToggleExpand(data.id)}
                  src={downArrow}
                  alt=""
                  srcset=""
                  className={
                    expandedItems.has(data.id) ? "arrow-up" : "arrow-down"
                  }
                />
                <button className="read-full-button">
                  {expandedItems.has(data.id) ? "Read Less" : "Read Full"}
                </button>
              </div>
            )}
          </div>
          {data.video_url && (
            <div>
              <ReactPlayer
                url={data.video_url}
                light={data.thumbnail_url}
                controls
                playing={false}
                width={300}
                height={200}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OriginalResearch2;
