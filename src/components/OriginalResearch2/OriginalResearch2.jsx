import React, { useEffect, useState } from "react";

import CustomSearch from "../CustomComponents/CustomSearch/CustomSearch";
import "../../css/SwiftFoliosReserch/SwiftFoliosResearch.css";
import OriginalResearch2HorizontalDisplay from "./OriginalResearch2HorizontalDisplay";
import OriginalResearch2Main from "./OriginalResearch2Main";
import OriginalResearch2VerticalDisplay from "./OriginalResearch2VerticalDisplay";
import Pulse from "../CustomComponents/Loader/Pulse";
import ServerRequest from "../../utils/ServerRequest";

import download from "../../assets/icons/download_icon.svg";
import useMarketStock from "../../hooks/useMarketStock";

const OriginalResearch2 = ({ fundData }) => {
  // console.log("fundData", fundData);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

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

        setAllData(normalizedData);
        setLoading(false);
        console.log("data", normalizedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
        >
          <div className="swift-folios-research-sub-container">
            <OriginalResearch2HorizontalDisplay stockCode={data.stock_code} />
            <OriginalResearch2Main
              heading={data.heading}
              body={data.description}
            />
            <div className="swift-folios-research-row3">
              {data?.related_stock?.map((stock, idx) => (
                <OriginalResearch2VerticalDisplay stockCode={stock} />
              ))}
            </div>
            <div className="swift-folios-research-file-container">
              <div className="swift-folios-research-file">
                <img src={download} alt="file preview" />
              </div>
              <a
                href={data.file_url}
                download="filename.pdf"
                className="swift-folios-research-file-download-button"
              >
                Download
              </a>
            </div>
          </div>
          {data.video_url && (
            <video controls width="300">
              <source src={data.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      ))}
    </div>
  );
};

export default OriginalResearch2;
