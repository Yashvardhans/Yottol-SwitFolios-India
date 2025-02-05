import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

import SwiftFoliosModal from "../CustomComponents/SwiftFoliosModal/SwiftFoliosModal";
import ImageEditor from "../CustomComponents/ImageEditorComponent/ImageEditor";
import CustomDropdown from "../CustomComponents/CustomDropdown/CustomDropdown";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import CustomInputError from "../CustomComponents/CustomInput/CustomInputError";
import { Alert } from "../CustomComponents/CustomAlert/CustomAlert";

import ServerRequest from "../../utils/ServerRequest";
import Pulse from "../CustomComponents/Loader/Pulse";

import "./BackOfficeUpdateForm.css";

const BackOfficeMainDisplayEditForm = ({ postData, onClose }) => {
  console.log("pd",postData);
  
  const navigate = useNavigate();
  const [type, setType] = useState(postData?.video_url ? "video" : "post");
  const [heading, setHeading] = useState(postData?.heading || "");
  const [body, setBody] = useState(postData?.description || "");
  const [attachments, setAttachments] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  console.log("post data",postData);
  

  const postId = postData.id;
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (videoURL) {
      showError(
        "You can only upload a video file or enter a video URL, not both."
      );
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
    if (type === "video" && !videoFile && !videoURL)
      newErrors.video = "Video file or URL is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const currentDate = new Date().toISOString().split("T")[0];
    const formData = new FormData();
    formData.append("body", body);
    formData.append("date", JSON.stringify(currentDate));
    formData.append("heading", heading);
    formData.append("videoUrl", videoURL);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
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
        method: "put",
        URL: `/back-office/post/${postId}/update`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (request?.message === "Data updated successfully") {
        showError("Form updated successfully");
        onClose();
      }
    } catch (error) {
      showError("Error submitting the form");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="swift-folios-research-back-office-form-container">
      {loading ? (
        <div className="swift-folios-research-back-office-loader">
          <p>Loading</p>
          <Pulse />
        </div>
      ) : (
        <form>
          <div className="swift-folios-research-back-office-post-edit-header">
            <div></div>
            <button className="form-close-button" onClick={onClose}>
              ✖
            </button>
          </div>
          <div className="swift-folios-research-back-office-form-group">
            <CustomDropdown
              label={"Type"}
              options={["post", "video"]}
              selected={type}
              onChange={(value) => setType(value)}
            />
          </div>

          {(type === "post" || type === "video") && (
            <>
              <div className="swift-folios-research-back-office-form-group">
                <label
                  htmlFor="heading"
                  className="swift-folios-research-back-office-form-text"
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

              <div className="swift-folios-research-back-office-form-group react-quill-group">
                <label
                  htmlFor="body"
                  className="swift-folios-research-back-office-form-text"
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

              <div className="swift-folios-research-back-office-form-group">
                <div className="swift-folios-research-back-office-file-group">
                  <label
                    htmlFor="attachments"
                    className="swift-folios-research-back-office-form-text"
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
                    <div className="swift-folios-research-back-office-file-display">
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
                  <div className="swift-folios-research-back-office-form-group">
                    <div className="swift-folios-research-back-office-file-group">
                      <label
                        htmlFor="videoFile"
                        className="swift-folios-research-back-office-form-text"
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
                        <div className="swift-folios-research-back-office-file-display">
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

                  <div className="swift-folios-research-back-office-form-group">
                    <label
                      htmlFor="videoURL"
                      className="swift-folios-research-back-office-form-text"
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
                  <div className="swift-folios-research-back-office-form-group">
                    <CustomButton
                      text="Edit Image"
                      onClick={() => setIsImageEditorOpen(true)}
                      classname="swift-folios-research-back-office-form-image-edit-button"
                    />
                  </div>
                </>
              )}

              <div className="swift-folios-research-back-office-form-group">
                <CustomButton
                  text="Submit"
                  classname="swift-folios-research-back-office-form-submit-button"
                  onClick={handleSubmit}
                />
              </div>
            </>
          )}
        </form>
      )}

      {isImageEditorOpen && (
        <SwiftFoliosModal closeModal={() => setIsImageEditorOpen(false)}>
          <div className="swift-folios-research-back-office-form-image-editor-modal">
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

export default BackOfficeMainDisplayEditForm;
