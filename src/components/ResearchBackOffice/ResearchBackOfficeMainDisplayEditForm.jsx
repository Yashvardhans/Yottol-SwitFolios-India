import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

import SwiftFoliosModal from "../CustomComponents/SwiftFoliosModal/SwiftFoliosModal";
import ImageEditor from "../CustomComponents/ImageEditorComponent/ImageEditor";
import CustomDropdown from "../CustomComponents/CustomDropdown/CustomDropdown";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import CustomBodyComponent from "../CustomComponents/CustomBodyComponent/CustomBodyComponent";
import CustomInputError from "../CustomComponents/CustomInput/CustomInputError";
import { Alert } from "../CustomComponents/CustomAlert/CustomAlert";
import CustomSelect from "../CustomComponents/CustomSelect/CustomSelect";

import ServerRequest from "../../utils/ServerRequest";
import Pulse from "../CustomComponents/Loader/Pulse";

import "./ResearchBackOfficeUpdateForm.css";

const ResearchBackOfficeMainDisplayEditForm = ({ postData, onClose }) => {
  const navigate = useNavigate();
  const [type, setType] = useState(postData?.video_url ? "video" : "post");
  const [heading, setHeading] = useState(postData?.heading || "");
  const [body, setBody] = useState(postData?.description || "");
  const [attachments, setAttachments] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState(postData?.video_url);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
  const showSucces = (msg) => {
    return Alert({
      TitleText: "Success",
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

  const isValidUrl = (str) => {
    const pattern = new RegExp(
      "^([a-zA-Z]+:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return pattern.test(str);
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

    if (file.size > 10 * 1024 * 1024) {
      showError("Attachment size exceeds 10MB");
      return;
    }

    setAttachments(file);
  };
  useEffect(() => {
    if (type === "post") {
      setVideoFile(null);
      setVideoURL(null);
      setThumbnailFile(null);
    }
  }, [type]);

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
    if (type === "video" && videoURL && !isValidUrl(videoURL)) {
      showError("Please enter a valid video URL.");
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
    if (type === "video" && !thumbnailFile) {
      showError("Please provide either a Thumbnail File");
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0];
    const formData = new FormData();
    formData.append("body", body);
    formData.append("date", JSON.stringify(currentDate));
    formData.append("heading", heading);
    formData.append("videoUrl", videoURL);

    if (attachments) formData.append("file", attachments);
    if (videoFile) formData.append("videoFile", videoFile);
    if (thumbnailFile) formData.append("thumbnailFile", thumbnailFile);

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
        showSucces("Form updated successfully");
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
        <div className="swift-folios-research-back-office-main-display-edit-loader">
          <p>Loading</p>
          <Pulse />
        </div>
      ) : (
        <form>
          {/* Header Section */}
          <div className="swift-folios-research-back-office-post-edit-header">
            <div className="header-content">
              <div className="header-dropdown">
              <CustomSelect
              heading="Type"
              options={["post", "video"]}
              defaultIndex={0}
              onTypeChange={(value) => setType(value)}
              placeholder="Select Type"
              error={errors.type}
            />
              </div>
              <button
                className="form-close-button edit-form-close-button"
                onClick={onClose}
              >
                ✖
              </button>
            </div>
          </div>

          {(type === "post" || type === "video") && (
            <>
              {/* Heading Input */}
              <div className="swift-folios-research-back-office-form-group">
                <CustomInputError
                  labelText="Heading"
                  type="text"
                  name="heading"
                  classnameLabel="swift-folios-research-back-office-form-text"
                  classnameInput="swift-folios-research-back-office-form-text-input"
                  value={heading}
                  onInputChange={(name, value) => setHeading(value)}
                  error={errors.heading}
                />
              </div>

              {/* Body Input */}
              <CustomBodyComponent
                label="Body"
                value={body}
                onChange={setBody}
                error={errors.body}
                containerClassName="swift-folios-research-back-office-form-group react-quill-group"
                labelClassName="swift-folios-research-back-office-form-body-text"
                editorClassName="react-quill"
                errorClassName="error-text error-body"
              />

              {/* PDF Upload */}
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
                  {/* Video Upload */}
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

                  <div className="swift-folios-research-back-office-video-option-separator">
                    OR
                  </div>
                  <div className="swift-folios-research-back-office-form-group">
                    <CustomInputError
                      labelText="Video URL"
                      type="text"
                      name="videoURL"
                      value={videoURL}
                      classnameLabel={
                        "swift-folios-research-back-office-video-url"
                      }
                      onInputChange={(name, value) => setVideoURL(value)}
                      error={errors.video}
                    />
                  </div>

                  <div className="swift-folios-research-back-office-form-group swift-folios-research-back-office-thumbnail-content">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsImageEditorOpen(true);
                      }}
                      className="swift-folios-research-back-office-form-image-edit-button"
                    >
                      Upload Thumbnail
                    </button>
                    {thumbnailFile && (
                      <div className="swift-folios-research-file-display">
                        <p className="uploaded-file-name">
                          {thumbnailFile.name}
                        </p>
                        <button
                          className="remove-file-button"
                          onClick={() => setThumbnailFile(null)}
                        >
                          ✖
                        </button>
                      </div>
                    )}
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

      {/* Image Editor Modal */}
      {isImageEditorOpen && (
        <SwiftFoliosModal
          closeModal={(e) => {
            e?.stopPropogation();
            setIsImageEditorOpen(false);
          }}
        >
          <div
            className="swift-folios-research-back-office-form-image-editor-modal"
            onClick={(e) => e.stopPropagation()}
          >
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

export default ResearchBackOfficeMainDisplayEditForm;
