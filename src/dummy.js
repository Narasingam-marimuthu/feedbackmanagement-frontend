import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, Modal, Form } from "react-bootstrap";
import {
  FaPlus,
  FaEllipsisV,
  FaTag,
  FaBug,
  FaComment,
  FaLightbulb,
  FaCog,
  FaTimes,
} from "react-icons/fa"; // Import icons for tags
import { fetchFeedbacks } from "../features/feedback/feedbackSlice";
import titleImage from "../assets/images/title.png";
import androidImage from "../assets/images/android.png";
import iosImage from "../assets/images/ios.png";
import attachmentImage from "../assets/images/attachment.png";
import bugtagImage from "../assets/images/bugtag.png";
import deleteImage from "../assets/images/delete.png";
import descriptionImage from "../assets/images/description.png";
import editImage from "../assets/images/edit.png";
import featuresRequestImage from "../assets/images/featurerequesttag.png";
import ideaImage from "../assets/images/ideatag.png";
import moduleImage from "../assets/images/module.png";
import platformImage from "../assets/images/platform.png";
import tagImage from "../assets/images/tag.png";
import webImage from "../assets/images/web.png";

// Tag colors
const tagColors = {
  feedback: "#FFDD09", // Yellow
  bug: "#FF5733", // Red
  idea: "#33FF57", // Green
  futurerequest: "#33A1FF", // Blue
};

export default function Feedback() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [platform, setPlatform] = useState("");
  const [module, setModule] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [tag, setTag] = useState("");

  const { feedbacks, isLoading, error } = useSelector(
    (state) => state.feedback
  );

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAttachment(file);
  };

  const getTagColor = (tag) => {
    return tagColors[tag.trim().toLowerCase()] || "#FFDD09";
  };

  const getPlatform = (platform) => {
    switch (platform) {
      case 1:
        return "Android";
      case 2:
        return "IOS";
      case 3:
        return "Web";
      default:
        return "";
    }
  };

  const getModule = (module) => {
    switch (module) {
      case 1:
        return "Channel";
      case 2:
        return "Project";
      case 3:
        return "Task";
      case 4:
        return "Chat";
      case 5:
        return "Alert";
      default:
        return "";
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className="d-flex flex-column justify-content-between align-items-center"
      style={{ backgroundColor: "#383D48", height: "fit-content" }}
    >
      <div
        className="p-4 my-4 w-75"
        // style={{
        //   backgroundColor: "#1e3b6e",
        //   borderRadius: "10px",
        //   maxHeight: "80%",
        //   overflowY: "auto",
        //   width: "100%",
        // }}
      >
        {feedbacks && feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="feedback-item p-3 mb-3"
              style={{
                backgroundColor: "#1C2437",
                maxHeight: "146px",
                maxWidth: "866px",
                paddingTop: "20px",
                color: "white",
                borderRadius: "8px",
                borderColor: "#383D48",
                position: "relative",
              }}
            >
              <p className="text-start" style={{ fontWeight: "bold" }}>
                {feedback.title}
              </p>
              <p className="text-start">{feedback.description}</p>

              <div className="d-flex align-items-center mt-2">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    marginRight: "10px",
                    padding: "5px 10px",
                    border: `1px solid ${getTagColor(feedback.tags)}`,
                    borderRadius: "10px",
                    color: getTagColor(feedback.tags),
                    backgroundColor: "transparent",
                  }}
                >
                  <FaTag
                    style={{
                      marginRight: "5px",
                      color: getTagColor(feedback.tags),
                    }}
                  />
                  {feedback.tags}
                </span>

                <span
                  style={{
                    padding: "5px 10px",
                    border: "1px solid #E49A2C",
                    borderRadius: "10px",
                    color: "#E49A2C",
                    backgroundColor: "transparent",
                    marginRight: "10px",
                  }}
                >
                  {getPlatform(feedback.platform)}
                </span>

                <span
                  style={{
                    padding: "5px 10px",
                    border: "1px solid #FFDD09",
                    borderRadius: "10px",
                    color: "#FFDD09",
                    backgroundColor: "transparent",
                  }}
                >
                  {getModule(feedback.module)}
                </span>
              </div>

              <Dropdown
                align="end"
                style={{ position: "absolute", top: "10px", right: "10px" }}
              >
                <Dropdown.Toggle
                  variant="link"
                  id={`dropdown-${feedback.id}`}
                  className="text-white"
                  style={{ backgroundColor: "transparent", border: "none" }}
                >
                  <FaEllipsisV />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item>Edit</Dropdown.Item>
                  <Dropdown.Item>Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ))
        ) : (
          <div>No feedbacks available.</div>
        )}
      </div>

      <Button
        variant="warning"
        className="d-flex align-items-center text-bold justify-content-center p-3"
        style={{
          backgroundColor: "#FFDD09",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "175px",
          height: "58px",
          fontSize: "15px",
          paddingLeft: "21px",
          paddingRight: "21px",
          paddingTop: "14px",
          paddingBottom: "14px",
          borderRadius: "10px",
        }}
        onClick={handleShow}
      >
        <FaPlus style={{ marginRight: "10px" }} />
        Add Feedback
      </Button>

     
    </div>
  );
}
