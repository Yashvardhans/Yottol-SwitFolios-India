import React, { useEffect, useState } from "react";

import BackOfficeHorizontalDisplay from "./BackOfficeHorizontalDisplay";
import BackOfficeMainDisplay from "./BackOfficeMainDisplay";
import BackOfficeVerticalDisplay from "./BackOfficeVerticalDisplay";
import BackOfficeUpdateForm from "./BackOfficeUpdateForm";
import BackOfficeStockEditForm from "./BackOfficeStockEditForm";

import SwiftFoliosModal from "../CustomComponents/SwiftFoliosModal/SwiftFoliosModal";
import Pulse from "../CustomComponents/Loader/Pulse";
import ServerRequest from "../../utils/ServerRequest";
import "../../css/BackOffice/BackOffice.css"
// import "../../css/SwiftFoliosReserch/SwiftFoliosResearch.css";

const BackOfficeDisplay = ({ fundData }) => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isEditStockModalOpen, setIsEditStockModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ServerRequest({
          method: "get",
          URL: "/back-office/post/get",
        });
        setAllData(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [allData]);

  

  const handleUpdateClick = (post) => {
    setSelectedPost(post);
    setIsUpdateModalOpen(true);
  };

  const handleEditStockClick = (post) => {
    setSelectedPost(post);
    setIsEditStockModalOpen(true);
  };

  const handleCloseModal = (e) => {
    e?.stopPropagation(); 
    e?.preventDefault()
    setIsUpdateModalOpen(false);
    setIsEditStockModalOpen(false);
    setSelectedPost(null);
  };

  return loading ? (
    <div className="swift-folios-research-back-office-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  ) : allData?.length === 0 ? (
    <div className="no-data-container">
      <p>No Data Available</p>
    </div>
  ) : (
    <div className="swift-folios-research-back-office-main">
      <div className="swift-folios-research-back-office-main-header-container">
        <p className="swift-folios-research-back-office-main-header">
          Original Research- SwiftResearch
        </p>
      </div>
      {allData?.map((data, index) => (
        <div
          key={index}
          className={
            !data.video_url
              ? "swift-folios-research-back-office-container"
              : "swift-folios-research-back-office-container-with-video"
          }
        >
          <div className="swift-folios-research-back-office-sub-container">
            <div className="swift-folios-research-back-office-row1">
              <BackOfficeHorizontalDisplay stockCode={data.stock_code} />
              <button onClick={() => handleUpdateClick(data)}  className="swift-folios-research-back-office-button">Update</button>
              <button onClick={() => handleEditStockClick(data.id) } className="swift-folios-research-back-office-button">Edit Stock</button>
            </div>
            <BackOfficeMainDisplay key={data.id} postDetails={data.post_details} />
            <div className="swift-folios-research-back-office-row3-container">
              {data?.related_stock?.map((stock, idx) => (
                <BackOfficeVerticalDisplay key={idx} stockCode={stock} />
              ))}
            </div>
          </div>
        </div>
      ))}
      {isUpdateModalOpen && (
        <SwiftFoliosModal  className="swift-folios-back-office-update-post-modal">
          <div className="modal"><BackOfficeUpdateForm postData={selectedPost} onClose={handleCloseModal} /></div>
        </SwiftFoliosModal>
      )}
      {isEditStockModalOpen && (
        <SwiftFoliosModal  className="swift-folios-back-office-edit-stock-modal">
          <div className="modal"><BackOfficeStockEditForm postId={selectedPost} onClose={handleCloseModal} /></div>
        </SwiftFoliosModal>
      )}
    </div>
  );
};

export default BackOfficeDisplay;
