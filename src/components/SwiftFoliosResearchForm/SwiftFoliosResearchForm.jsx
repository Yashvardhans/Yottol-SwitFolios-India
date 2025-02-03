import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

import SwiftFoliosModal from "../CustomComponents/SwiftFoliosModal/SwiftFoliosModal";
import ImageEditor from "../CustomComponents/ImageEditorComponent/ImageEditor";
import CustomDropdown from "../CustomComponents/CustomDropdown/CustomDropdown";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import CustomSearchableDropdown from "../CustomComponents/CustomSearchableDropdown/CustomSearchableDropdown";
import CustomInputError from "../CustomComponents/CustomInput/CustomInputError";
import { Alert } from "../CustomComponents/CustomAlert/CustomAlert";

import image from "../../assets/edited-image.png";

import ServerRequest from "../../utils/ServerRequest";
import Pulse from "../CustomComponents/Loader/Pulse";

import "./SwiftFoliosForm.css";
import StockSearch from "../CustomComponents/StockSearch/StockSearch";

const SwiftFoliosResearchForm = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [relatedStockSelections, setRelatedStockSelections] = useState([]);
  const [singleStockSelections, setSingleStockSelections] = useState([]);
  const [attachments, setAttachments] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const showError = (msg) => {
    return Alert({
      TitleText: "Warning",
      Message: msg,
      BandColor: "#e51a4b",

      AutoClose: {
        Active: true,
        Line: true,
        LineColor: "#e51a4b",
        Time: 3,
      },
    });
  };

  const uniqueId = `${Date.now()}`;
  console.log("Generated ID:", uniqueId);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (videoURL) {
      showError("You can only upload a video file or enter a video URL, not both.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showError("Video size exceeds 10MB");
      return;
    }
    setVideoFile(file);
  };
  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    console.log("Selected attachment file:", file);
    console.log("fiiiile", e.target.files);

    if (file.size > 10 * 1024 * 1024) {
      showError("Attachment size exceeds 10MB");
      return;
    }

    setAttachments(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!type) newErrors.type = "Type is required.";
    if (!heading.trim()) newErrors.heading = "Heading is required.";
    if (!body.trim()) newErrors.body = "Body content is required.";
    if (!singleStockSelections.length)
      newErrors.singleStock = "Please select at least one stock.";
    if (type === "video" && !videoFile && !videoURL)
      newErrors.video = "Video file or URL is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleURLChange = (e) => {
    const url = e.target.value;
    if (videoFile) {
      showError("You can only upload a video file or enter a video URL, not both.");
      return;
    }
    setVideoURL(url);
  };

  const handleRelatedStockSelection = (selectedStock) => {
    console.log("se", selectedStock);

    if (relatedStockSelections.length >= 3) {
      showError("You can select a maximum of 3 stocks.");
      return;
    }
    if (!relatedStockSelections.includes(selectedStock)) {
      setRelatedStockSelections([...relatedStockSelections, selectedStock]);
    }
  };

  const handleSingleStockSelection = (selectedStock) => {
    if (relatedStockSelections.length >= 1) {
      showError("You can select only one stock.");
      return;
    }
    if (!singleStockSelections.includes(selectedStock)) {
      setSingleStockSelections([selectedStock]);
    }
  };

  const handleRemoveStock = (stock) => {
    setRelatedStockSelections(
      relatedStockSelections.filter((s) => s !== stock)
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (type === "video" && videoFile && videoURL) {
      showError("Please provide either a video file or a video URL, not both.");
      return;
    }
    if (type === "video" && !videoFile && !videoURL) {
      showError("Please provide a video file or a video URL.");
      return;
    }
    if (!type) {
      showError("Please select a type.");
      return;
    }

    if (!heading.trim()) {
      showError("Please enter a heading.");
      return;
    }

    if (!body.trim()) {
      showError("Please enter content for the body.");
      return;
    }

    if (type === "video" && !videoFile && !videoURL) {
      showError("Please provide either a video file or a video URL.");
      return;
    }

    if (type === "post" && !attachments) {
      showError("Please upload a PDF.");
      return;
    }

    if (singleStockSelections.length === 0) {
      showError("Please select a single stock.");
      return;
    }

    if (relatedStockSelections.length === 0) {
      showError("Please select at least one related stock.");
      return;
    }
    const currentDate = new Date().toISOString().split("T")[0];
    const formData = new FormData();
    formData.append("id", uniqueId);
    formData.append("body", body);
    formData.append("date", JSON.stringify(currentDate));
    formData.append("heading", heading);
    formData.append("stockData", singleStockSelections);
    formData.append("relatedStockData", JSON.stringify(relatedStockSelections));
    formData.append("videoUrl", videoURL);
    if (attachments) {
      formData.append("file", attachments);
    }
    if (videoFile) {
      formData.append("videoFile", videoFile);
    }
    if (thumbnailFile) {
      formData.append("thumbnailFile", thumbnailFile);
    }

    try {
      setLoading(true);
      const request = await ServerRequest({
        method: "post",
        URL: "/swift-folios-research/form-data/post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (request?.message === "Data added successfully") {
        showError("Form submitted successfully");
        navigate("/research2");
      }
    } catch (error) {
      showError("Error submitting the form");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="swift-folios-research-form-container">
      {loading ? (
        <div className="swift-folios-research-loader">
          <p>Loading</p>
          <Pulse />
        </div>
      ) : (
        <form >
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
              <div className="swift-folios-research-form-stock-container">
                <label htmlFor="" className="stock-label">
                  Select Stock
                </label>
                <StockSearch
                  handleSelect={(s) => {
                    handleSingleStockSelection(s);
                  }}
                />
                <div className="selected-stocks">
                  {singleStockSelections.length > 0 && (
                    <div className="selected-stocks">
                      {singleStockSelections.map((stock, index) => (
                        <div key={index} className="selected-stock-item">
                          <span>{stock}</span>
                          <button
                            className="remove-stock-button"
                            onClick={() => handleRemoveStock(stock)}
                          >
                            ✖
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.singleStock && (
                  <p className="error-text">{errors.singleStock}</p>
                )}
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
                  onInputChange={(name, inputValue) => setHeading(inputValue)}
                />
                {errors.heading && (
                  <p className="error-text">{errors.heading}</p>
                )}
              </div>

              <div className="swift-folios-research-form-group react-quill-group">
                <label
                  htmlFor="body"
                  className="swift-folios-research-form-text"
                >
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
              {errors.body && (
                <p className="error-text error-body">{errors.body}</p>
              )}
              <div className="swift-folios-research-form-stock-container">
                <label htmlFor="" className="stock-label">
                  Select Related Stock
                </label>
                <StockSearch
                  handleSelect={(s) => {
                    handleRelatedStockSelection(s);
                  }}
                />
                <div className="selected-stocks">
                  {relatedStockSelections.length > 0 && (
                    <div className="selected-stocks">
                      {relatedStockSelections.map((stock, index) => (
                        <div key={index} className="selected-stock-item">
                          <span>{stock}</span>
                          <button
                            className="remove-stock-button"
                            onClick={() => handleRemoveStock(stock)}
                          >
                            ✖
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="swift-folios-research-form-group">
                <div className="swift-folios-research-file-group">
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
                  onChange={handleAttachmentChange}
                  style={{ display: "none", cursor: "pointer" }}
                />
                {attachments && (
                  <div className="swift-folios-research-file-display">
                  <p className="uploaded-file-name">{attachments.name}</p>
                  <button
                    className="remove-file-button"
                    onClick={() => setAttachments(null)}
                  >
                    ✖
                  </button>
                </div>
                )}
                </div>
              </div>

              {type === "video" && (
                <>
                  <div className="swift-folios-research-form-group">
                    <div className="swift-folios-research-file-group">
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
                    {videoFile && (
                      <div className="swift-folios-research-file-display">
                      <p className="uploaded-file-name">{videoFile.name}</p>
                      <button
                        className="remove-file-button"
                        onClick={() => setVideoFile(null)}
                      >
                        ✖
                      </button>
                    </div>
                    )}
                    </div>
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
                      onInputChange={(name, inputValue) =>
                        setVideoURL(inputValue)
                      }
                    />
                    {errors.video && (
                      <p className="error-text">{errors.video}</p>
                    )}
                  </div>
                  <div className="swift-folios-research-form-group">
                    <CustomButton
                      text="Edit Image"
                      onClick={() => setIsImageEditorOpen(true)}
                      classname="swift-folios-research-form-image-edit-button"
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
      )}

      {isImageEditorOpen && (
        <SwiftFoliosModal closeModal={() => setIsImageEditorOpen(false)}>
          <div className="swift-folios-research-form-image-editor-modal">
            <ImageEditor
              onSave={(fileName) => {
                setThumbnailFile(fileName);
                setIsImageEditorOpen(false);
              }}
            />
          </div>
        </SwiftFoliosModal>
      )}
    </div>
  );
};

export default SwiftFoliosResearchForm;
