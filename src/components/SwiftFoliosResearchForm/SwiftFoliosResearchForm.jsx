import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import SwiftFoliosModal from "../CustomComponents/SwiftFoliosModal/SwiftFoliosModal";
import ImageEditor from "../CustomComponents/ImageEditorComponent/ImageEditor";
import CustomDropdown from "../CustomComponents/CustomDropdown/CustomDropdown";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import CustomSearchableDropdown from "../CustomComponents/CustomSearchableDropdown/CustomSearchableDropdown";
import CustomInputError from "../CustomComponents/CustomInput/CustomInputError";

import image from "../../assets/edited-image.png";

import ServerRequest from "../../utils/ServerRequest";

import "./SwiftFoliosForm.css";
import StockSearch from "../CustomComponents/StockSearch/StockSearch";

const SwiftFoliosResearchForm = () => {
  console.log(process.env.REACT_APP_REQUEST_BASE_URL);

  const allStocks = [
    "Stock 1",
    "Stock 2",
    "Stock 3",
    "Stock 4",
    "Stock 5",
    "Stock 2 2",
  ];
  const [type, setType] = useState("");
  const [heading, setHeading] = useState("heading");
  const [body, setBody] = useState("");
  const [stockSelections, setStockSelections] = useState([null, null, null]);
  const [attachments, setAttachments] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState();

  const uniqueId = `${Date.now()}`;
  console.log("Generated ID:", uniqueId);

  const stockData = "1234";
  const relatedStockData = ["1234", "4567", "8910"];
  const video_File = null;
  const video_URL = "www.google.com";
  const thumbnail_File = new File(
    ["This is the thumbnail content"],
    "thumbnail.jpg",
    {
      type: "image/jpeg",
    }
  );

  console.log("thumb", thumbnail_File);

  const handleStockSelection = (value, index) => {
    const updatedStocks = [...stockSelections];
    updatedStocks[index] = value;
    setStockSelections(updatedStocks);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (videoURL) {
      alert("You can only upload a video file or enter a video URL, not both.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Video size exceeds 10MB");
      return;
    }
    setVideoFile(file);
  };

  const handleURLChange = (e) => {
    const url = e.target.value;
    if (videoFile) {
      alert("You can only upload a video file or enter a video URL, not both.");
      return;
    }
    setVideoURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (type === "video" && videoFile && videoURL) {
    //   alert("Please provide either a video file or a video URL, not both.");
    //   return;
    // }
    // if (type === "video" && !videoFile && !videoURL) {
    //   alert("Please provide a video file or a video URL.");
    //   return;
    // }
    const formData = new FormData();
    formData.append("id", uniqueId);
    formData.append("body", body);
    formData.append("heading", heading);
    formData.append("stockData", stockData);
    formData.append("relatedStockData", JSON.stringify(relatedStockData));
    formData.append("videoUrl", video_URL);
    if (attachments) {
      formData.append("file", attachments);
    }
    if (video_File) {
      formData.append("videoFile", video_File);
    }
    if (thumbnail_File) {
      formData.append("thumbnailFile", thumbnail_File);
    }
    const request = await ServerRequest({
      method: "post",
      URL: "/swift-folios-research/form-data/post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log({
      type,
      heading,
      body,
      stockData,
      relatedStockData,
      thumbnail_File,
      video_File,
      video_URL,
    });
  };

  return (
    <div className="swift-folios-research-form-container">
      <form onSubmit={handleSubmit}>
        <div className="swift-folios-research-form-group">
          <CustomDropdown
            label={"Type"}
            options={["post", "video"]}
            selected={type}
            onChange={(value) => setType(value)}
          />
        </div>

        {(type === "post" || type === "video") && (
          <>
            <div className="swift-folios-research-form-group">
              <CustomButton
                text="Edit Image"
                onClick={() => setIsImageEditorOpen(true)}
                classname="swift-folios-research-form-image-edit-button"
              />
            </div>

            <div className="swift-folios-research-form-stock-container">
              <StockSearch
                handleSelect={(s) => {
                  console.log("handle click call", s);
                }}
              />
              {stockSelections.map((selectedStock, index) => (
                <div className="swift-folios-research-form-group" key={index}>
                  <CustomSearchableDropdown
                    label={`Select Stock ${index + 1}`}
                    options={allStocks}
                    selected={selectedStock}
                    onChange={(value) => handleStockSelection(value, index)}
                  />
                </div>
              ))}
            </div>

            <div className="swift-folios-research-form-group">
              <label
                htmlFor="heading"
                className="swift-folios-research-form-text"
              >
                Heading
              </label>
              <CustomInputError
                type="text"
                id="heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
              />
            </div>

            <div className="swift-folios-research-form-group">
              <label htmlFor="body" className="swift-folios-research-form-text">
                Body
              </label>
              <ReactQuill
                value={body}
                onChange={setBody}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["bold", "italic", "underline"],
                    ["link"],
                    [{ size: ["small", false, "large", "huge"] }],
                  ],
                }}
                formats={[
                  "header",
                  "font",
                  "list",
                  "bold",
                  "italic",
                  "underline",
                  "link",
                  "size",
                ]}
                style={{
                  height: "150px",
                  width: "60vw",
                  marginBottom: "20px",
                }}
              />
            </div>

            <div className="swift-folios-research-form-group">
              <label
                htmlFor="attachments"
                className="swift-folios-research-form-text"
              >
                Upload Pdf
              </label>
              <input
                type="file"
                id="attachments"
                accept=".pdf"
                onChange={(e) =>
                  setAttachments([...attachments, e.target.files[0]])
                }
                style={{ display: "none", cursor: "pointer" }}
              />
            </div>

            {type === "video" && (
              <>
                <div className="swift-folios-research-form-group">
                  <label
                    htmlFor="videoFile"
                    className="swift-folios-research-form-text"
                  >
                    Upload Video
                  </label>
                  <input
                    type="file"
                    id="videoFile"
                    accept="video/*"
                    onChange={handleFileChange}
                    style={{ display: "none", cursor: "pointer" }}
                  />
                </div>

                <div className="swift-folios-research-form-group">
                  <label
                    htmlFor="videoURL"
                    className="swift-folios-research-form-text"
                  >
                    Video URL
                  </label>
                  <CustomInputError
                    type="text"
                    id="videoURL"
                    value={videoURL}
                    onChange={handleURLChange}
                  />
                </div>
              </>
            )}

            <div className="swift-folios-research-form-group">
              <CustomButton
                text="Submit"
                classname="swift-folios-research-form-submit-button"
                onClick={handleSubmit}
              />
            </div>
          </>
        )}
      </form>

      {isImageEditorOpen && (
        <SwiftFoliosModal closeModal={() => setIsImageEditorOpen(false)}>
          <div className="swift-folios-research-form-image-editor-modal">
            <ImageEditor
              onSave={(fileName) => {
                setThumbnailFile(fileName);
                setIsImageEditorOpen(false); // Close the modal after saving
              }}
            />
          </div>
        </SwiftFoliosModal>
      )}
    </div>
  );
};

export default SwiftFoliosResearchForm;
