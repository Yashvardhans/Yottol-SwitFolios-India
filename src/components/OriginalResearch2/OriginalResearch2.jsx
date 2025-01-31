import React, { use, useEffect, useState } from "react";
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
import useMarketStock from "../../hooks/useMarketStock";

const OriginalResearch2 = ({ fundData }) => {
  // console.log("fundData", fundData);
  const accountCode = "BRC4897812"
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visitedItems, setVisitedItems] = useState(new Set());
 
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
            : [], // Parse or set empty array
        }));

        const visitedData=  await ServerRequest({
          method: "get",
          URL: "/swift-folios-research/visit-status/get",
        
        });
        console.log("vis",visitedData);
        
        const visitedIds = visitedData?.data
        .filter((item) => item.account_id === accountCode && item.visit_status === "1")
        .map((item) => item.id);

        setVisitedItems(new Set(visitedIds));
        setAllData(normalizedData);
        setLoading(false);
        console.log("data", normalizedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleVisitStatus = async(index,itemId) => {
    
    const data = {
      account_code  : accountCode,
      item_id : itemId,
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

  }

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
  console.log("allData", allData);

  const stock_data = useMarketStock("HDFCBANK");

  const handleFileDownload = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("File not found or inaccessible");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileUrl.split("/").pop(); // Extract filename from URL
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  console.log(
    "stock_data",
    stock_data,
    stock_data?.last_traded_price,
    stock_data?.change_price,
    stock_data?.change_percentage
  );
  // console.log("stds",allData.data[0].related_stock);

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
            backgroundColor: visitedItems.has(data.id) ? "transparent" : "#FAFAFA",
          }}

        >
          <div className="swift-folios-research-sub-container">
            <OriginalResearch2HorizontalDisplay stockCode={data.stock_code} />
            <OriginalResearch2Main
              heading={data.heading}
              body={data.description}
              date={moment(data.date).format('Do MMMM YYYY')}
            />
            <div className="swift-folios-research-row3">
              {data?.related_stock?.map((stock, idx) => (
                <OriginalResearch2VerticalDisplay stockCode={stock} />
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
          </div>
          {data.video_url && (
            <div>
              
              <ReactPlayer
                url={data.video_url}
                // light ={data.thumbnail_url}
                controls
                playing={false}
                width={300}
                height={200}
              ></ReactPlayer>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OriginalResearch2;
