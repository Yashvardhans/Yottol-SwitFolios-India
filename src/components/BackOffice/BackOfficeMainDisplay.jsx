import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import downloadIcon from "../../assets/icons/download_icon.svg";
import ServerRequest from "../../utils/ServerRequest";
import SwiftFoliosModal from "../CustomComponents/SwiftFoliosModal/SwiftFoliosModal";

import playButton from "../../assets/play-button.png";

// import "../../css/SwiftFoliosReserch/SwiftFoliosResearch.css";
import "../../css/BackOffice/BackOffice.css";
import BackOfficeMainDisplayEditForm from "./BackOfficeMainDisplayEditForm";

const accountCode = "BRC4897812";

const BackOfficeMainDisplay = ({ postDetails }) => {
  console.log("play-button", playButton);

  const [visitedItems, setVisitedItems] = useState(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchVisitedData = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching visit status:", error);
      }
    };

    fetchVisitedData();
  }, []);

  const handleVisitStatus = async (itemId) => {
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
  const handleEditClick = (post) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
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

  const sortedDetails = [...postDetails].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const [oldestPost, ...remainingPosts] = sortedDetails;
  console.log("rem", remainingPosts);

  return (
    <div>
      {remainingPosts.length > 0 && (
        <div className="swift-folios-back-office-update-post-container">
          {remainingPosts.map((detail) => (
            <div
              key={detail.id}
              className={`swift-folios-back-office-research-row2 ${
                detail.video_url ? "with-video" : ""
              }`}
              onClick={() => handleVisitStatus(detail.id)}
              style={{
                backgroundColor: visitedItems.has(detail.id)
                  ? "transparent"
                  : "#FAFAFA",
              }}
            >
              <div className="swift-folios-back-office-row2-sub-container">
                <div className="swift-folios-research-back-office-row2-date">
                  {new Date(detail.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(detail);
                    }}
                    className="swift-folios-research-back-office-button"
                  >
                    Edit
                  </button>
                </div>
                <div className="swift-folios-research-back-office-row2-header">
                  {detail.heading}
                </div>
                <div
                  className="swift-folios-research-back-office-row2-text"
                  dangerouslySetInnerHTML={{ __html: detail.description }}
                ></div>

                {detail.file_url && (
                  <div className="swift-folios-research-file-container">
                    <div className="swift-folios-research-file">
                      <img src={downloadIcon} alt="file preview" />
                    </div>
                    <button
                      onClick={() => handleFileDownload(detail.file_url)}
                      className="swift-folios-research-file-download-button"
                    >
                      Download
                    </button>
                  </div>
                )}
              </div>
              {detail.video_url && (
                <div
                  key={detail.id}
                  style={{
                    position: "relative",
                    width: "365px",
                    height: "204px",
                  }}
                >
                  <ReactPlayer
                    key={detail.id}
                    url={detail.video_url}
                    light={
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundImage: `url(${detail.thumbnail_url})`,
                          backgroundSize: "cover",
                          filter: "blur(4px)",
                        }}
                      ></div>
                    }
                    playIcon={
                      <img
                        id={detail.id}
                        src={playButton}
                        alt="Play"
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          cursor: "pointer",
                        }}
                      />
                    }
                    controls
                    playing={false}
                    width="100%"
                    height="100%"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="swift-folios-back-office-original-post-container">
        {oldestPost && (
          <div
            key={oldestPost.id}
            className={`swift-folios-back-office-research-row2 ${
              oldestPost.video_url ? "with-video" : ""
            }`}
            onClick={() => handleVisitStatus(oldestPost.id)}
            style={{
              backgroundColor: visitedItems.has(oldestPost.id)
                ? "transparent"
                : "#FAFAFA",
            }}
          >
            <div className="swift-folios-back-office-row2-sub-container">
              <div className="swift-folios-research-back-office-row2-date">
                <span>Posted On {new Date(oldestPost.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(oldestPost);
                  }}
                  className="swift-folios-research-back-office-button"
                >
                  Edit
                </button>
              </div>
              <div className="swift-folios-research-row2-header">
                {oldestPost.heading}
              </div>
              <div
                className="swift-folios-research-back-office-row2-text"
                dangerouslySetInnerHTML={{ __html: oldestPost.description }}
              ></div>

              {oldestPost.file_url && (
                <div className="swift-folios-research-file-container">
                  <div className="swift-folios-research-file">
                    <img src={downloadIcon} alt="file preview" />
                  </div>
                  <button
                    onClick={() => handleFileDownload(oldestPost.file_url)}
                    className="swift-folios-research-file-download-button"
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
            {oldestPost.video_url && (
              <div
                key={oldestPost.id}
                style={{
                  position: "relative",
                  width: "365px",
                  height: "204px",
                }}
              >
                <ReactPlayer
                  url={oldestPost.video_url}
                  light={
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${oldestPost.thumbnail_url})`,
                        backgroundSize: "cover",
                        filter: "blur(4px)",
                      }}
                    ></div>
                  }
                  playIcon={
                    <img
                      id={oldestPost.id}
                      src={playButton}
                      alt="Play"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        cursor: "pointer",
                      }}
                    />
                  }
                  controls
                  playing={false}
                  width="100%"
                  height="100%"
                />
              </div>
            )}
          </div>
        )}
      </div>
      {isEditModalOpen && (
        <SwiftFoliosModal className="swift-folios-back-office-edit-post-modal">
          <div className="modal">
            <BackOfficeMainDisplayEditForm
              postData={selectedPost}
              onClose={() => setIsEditModalOpen(false)}
            />
          </div>
        </SwiftFoliosModal>
      )}
    </div>
  );
};

export default BackOfficeMainDisplay;
