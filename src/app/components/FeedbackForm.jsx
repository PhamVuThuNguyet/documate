import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/FeedbackForm.module.css";
import LoadingOverlay from "./LoadingOverlay";

const FeedbackForm = ({ onClose, inputRequest, outputResponse }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const queryParams = new URLSearchParams({
      input_request: inputRequest,
      output_response: outputResponse,
      rating: rating,
      feedback: feedback,
    }).toString();

    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbzu08elz2WGxgiWHOvWj3bNyZKKZ27SlsTn6G8cVX7Jwfoq3A9dXXoJN1Nc7P_6pfq21w/exec?${queryParams}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }

    setRating(0);
    setFeedback("");
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div>
          <div className={styles.closeButton} onClick={onClose}>
            &#10005;
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="rating" className="text-base font-semibold">
                Rating:
              </label>
              <div className={styles.starRating} id="rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <span
                    key={value}
                    className={
                      value <= (hoverRating || rating)
                        ? styles.starFilled
                        : styles.starEmpty
                    }
                    onClick={() => handleStarClick(value)}
                    onMouseEnter={() => handleStarHover(value)}
                    onMouseLeave={() => handleStarHover(0)}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="feedback" className="text-base font-semibold">
                Feedback:
              </label>
              <div className="mt-2">
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={handleFeedbackChange}
                  rows="5"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <div className="text-center mt-8">
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn}>
                Submit
              </button>
            </div>
          </form>
          <LoadingOverlay isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
