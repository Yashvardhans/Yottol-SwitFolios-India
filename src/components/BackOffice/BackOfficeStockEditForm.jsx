import React, { useState } from "react";
import StockSearch from "../CustomComponents/StockSearch/StockSearch";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import { Alert } from "../CustomComponents/CustomAlert/CustomAlert";
import ServerRequest from "../../utils/ServerRequest";
import "./BackOfficeStockEditForm.css";

const BackOfficeStockEditForm = ({ postId,onClose }) => {
  const [singleStockSelections, setSingleStockSelections] = useState([]);
  const [relatedStockSelections, setRelatedStockSelections] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const showSuccess = (msg) => {
    return Alert({
      TitleText: "Success",
      Message: msg,
      BandColor: "#28a745",
      AutoClose: {
        Active: true,
        Line: true,
        LineColor: "#28a745",
        Time: 3,
      },
    });
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

  const handleRelatedStockSelection = (selectedStock) => {
    if (relatedStockSelections.length >= 3) {
      showError("You can select a maximum of 3 stocks.");
      return;
    }
    if (!relatedStockSelections.includes(selectedStock)) {
      setRelatedStockSelections([...relatedStockSelections, selectedStock]);
    }
  };

  const handleRemoveStock = (stock) => {
    setRelatedStockSelections(relatedStockSelections.filter((s) => s !== stock));
    setSingleStockSelections(singleStockSelections.filter((s) => s !== stock));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (singleStockSelections.length === 0) {
      showError("Please select a single stock.");
      return;
    }
    if (relatedStockSelections.length === 0) {
      showError("Please select at least one related stock.");
      return;
    }

    const formData = new FormData();
    formData.append("stockData", singleStockSelections);
    formData.append("relatedStockData", JSON.stringify(relatedStockSelections));

    try {
      setLoading(true);
      const response = await ServerRequest({
        method: "put",
        URL: `/back-office/post/stock/${postId}/edit`,
        data: formData,
      });
      if (response && response.message === "Stock updated successfully") {
        showSuccess("Stock updated successfully");
      } else {
        showError("Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      showError("Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="back-office-stock-edit-header">
      <h2>Edit Stock Information</h2>
      <button className="close-modal" onClick={onClose}>✖</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="back-office-stock-container">
          <label className="stock-label">Select Stock</label>
          <div className="stock-container"> {/* Wrap StockSearch in stock-container */}
            <StockSearch handleSelect={handleSingleStockSelection} />
          </div>
          <div className="selected-stocks">
            {singleStockSelections.length > 0 &&
              singleStockSelections.map((stock, index) => (
                <div key={index} className="selected-stock-item">
                  <span>{stock}</span>
                  <button
                    type="button"
                    className="remove-stock-button"
                    onClick={() => handleRemoveStock(stock)}
                  >
                    ✖
                  </button>
                </div>
              ))}
          </div>
          {errors.singleStock && <p className="error-text">{errors.singleStock}</p>}
        </div>
        <div className="back-office-stock-container">
          <label className="stock-label">Select Related Stock</label>
          <div className="stock-container"> {/* Wrap StockSearch in stock-container */}
            <StockSearch handleSelect={handleRelatedStockSelection} />
          </div>
          <div className="selected-stocks">
            {relatedStockSelections.length > 0 &&
              relatedStockSelections.map((stock, index) => (
                <div key={index} className="selected-stock-item">
                  <span>{stock}</span>
                  <button
                    type="button"
                    className="remove-stock-button"
                    onClick={() => handleRemoveStock(stock)}
                  >
                    ✖
                  </button>
                </div>
              ))}
          </div>
        </div>
        <CustomButton type="submit" text={loading ? "Saving..." : "Save Changes"} />
      </form>
    </div>
  );
};

export default BackOfficeStockEditForm;