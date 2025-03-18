import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import "../../src/feedBack.css";
import {
  Popover,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";

import { Image } from "react-bootstrap";
import {
  FaPlus,
  FaEllipsisV,
  FaTag,
  FaBug,
  FaComment,
  FaLightbulb,
  FaCog,
  FaTimes,
} from "react-icons/fa";
import {
  fetchFeedbacks,
  reset,
  addFeedbacks,
  fetchFeedbackById,
  updateFeedbacks,
  deleteFeedbacks,
} from "../features/feedback/feedbackSlice";
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
import feedBackImage from "../assets/images/feedbacktag.png";
import channelImage from "../assets/images/channel.png";
import projectImage from "../assets/images/project.png";
import taskImage from "../assets/images/task.png";
import chatImage from "../assets/images/chat.png";
import alertImage from "../assets/images/alert.png";

const tagColors = {
  feedback: "#FFDD09",
  bug: "#FF5733",
  idea: "#33FF57",
  featurerequest: "#33A1FF",
};

const tagImages = {
  feedback: feedBackImage,
  bug: bugtagImage,
  idea: ideaImage,
  featurerequest: featuresRequestImage,
};

const platformImages = {
  android: androidImage,
  ios: iosImage,
  web: webImage,
};

export default function Feedback() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [platform, setPlatform] = useState([]);
  const [title, setTitle] = useState("");
  const [module, setModule] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  // const [tags, setTags] = useState(["Feed Back","Bug Report", "Idea", "Feature Request"]);
  const [tag, setTag] = useState("");
  const [previousAttachment, setPreviousAttachment] = useState(null);
  const [feedbackId, setFeedbackId] = useState(null);
  const [deleteFeedbackId, setDeleteFeedbackId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [errors, setErrors] = useState({
    title: "",
    platform: [],
    module: "",
    description: "",
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    clearForm();
    setShowModal(false);
  };

  const handleDeleteShow = () => setshowDeleteModal(true);
  const handleDeleteClose = () => setshowDeleteModal(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickClose = () => {
    setAnchorEl(null);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAttachment(file);
  };

  const { feedbacks, isLoading, error } = useSelector(
    (state) => state.feedback
  );
  const feedback = useSelector((state) => state.feedback);

  const getLabel = (value) => {
    switch (value) {
      case "1":
        return "Android";
      case "2":
        return "iOS";
      case "3":
        return "Web";
      default:
        return "Select Platform";
    }
  };
  // Fetching feedback

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  if (isLoading) {
    return (
      <>
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </>
    );
  }

  // Function for clear form
  const clearForm = () => {
    console.log("clear form");
    dispatch(reset());
    setFeedbackId(null);
    setTitle("");
    setPlatform([]);
    setModule("");
    setDescription("");
    setAttachment(null);
    setTag("");
  };

  console.log(platform, "platformnaras");
  

  // FUnction for add and update feed back

  const handleSubmit = () => {
    const isValid = validateForm();
    if (isValid) {
      handleAddOrUpdateFeedback(feedbackId);
    }
  };

  const handleAddOrUpdateFeedback = async (feedbackId) => {
    try {
      console.log(feedbackId, "feedbackId");
      let formData = new FormData();
      formData.append("title", title);
      formData.append("platform", platform);
      formData.append("module", module);
      formData.append("description", description);
      formData.append("tags", tag);

      if (attachment && attachment !== previousAttachment) {
        formData.append("attachment", attachment);
      }
      console.log(previousAttachment, "previousAttachment");
      console.log(
        title,
        module,
        platform,
        description,
        tag,
        attachment,
        previousAttachment,
        "formdata"
      );

      if (feedbackId) {
        const updateResponse = await dispatch(
          updateFeedbacks({ id: feedbackId, feedback: formData })
        );
        console.log(updateResponse.payload, ":updated res");

        if (updateResponse.payload.data.success) {
        } else {
          console.log(updateResponse.payload.data, "update response else case");
        }
      } else {
        const addResponse = await dispatch(addFeedbacks(formData));
        if (addResponse.payload.data.success) {
        } else {
          console.log(addResponse.payload.data, "add response else case");
        }
      }
      clearForm();
      handleClose();
    } catch (error) {
      console.error("Error adding or updating feedback:", error);
    }
  };

  // Function for bind data for edit
  const getFeedbackById = async (id) => {
    try {
      handleClickClose();
      const action = await dispatch(fetchFeedbackById(parseInt(id)));
      const feedbackData = action.payload;
      if (feedbackData) {
        console.log("Feedback Data:", feedbackData);
        setTitle(feedbackData.title);
        setPlatform(feedbackData.platform.split(","));
        setModule(feedbackData.module);
        setDescription(feedbackData.description);
        setAttachment(feedbackData.attachment);
        setTag(feedbackData.tags);
        setFeedbackId(feedbackData.id);
        setPreviousAttachment(feedbackData.attachment || null);
      }
      handleShow();
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  // Function for delete confirmation and delete
  const handleDeleteConfirm = (id) => {
    handleClickClose();
    setDeleteFeedbackId(id);
    handleDeleteShow();
  };

  const handleDelete = () => {
    try {
      dispatch(deleteFeedbacks(deleteFeedbackId));
      setDeleteFeedbackId(null);
      handleDeleteClose();
      setDeleteFeedbackId(null);
      dispatch(reset());
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  const validateForm = () => {
    let formErrors = { title: "", platform: "", module: "", description: "" };
    let isValid = true;

    if (!title) {
      formErrors.title = "Title is required";
      isValid = false;
    }
    if (!platform) {
      formErrors.platform = "Platform is required";
      isValid = false;
    }
    if (!module) {
      formErrors.module = "Module is required";
      isValid = false;
    }
    if (!description) {
      formErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };
  const getTagColor = (tag) => {
    return tagColors[tag && tag.trim().toLowerCase()] || "#FFDD09";
  };

  const getTagImage = (tag) => {
    return tagImages[tag && tag.trim().toLowerCase()] || tagImage;
  };

  const getPlatformImage = (platform) => {
    console.log(platform, "platform");

    const platforms = {
      1: androidImage,
      2: iosImage,
      3: webImage,
    };

    return platforms[platform] || platformImage;
    // switch (platform) {
    //   case 1:
    //     return androidImage;
    //   case 2:
    //     return iosImage;
    //   case 3:
    //     return webImage;
    //   default:
    //     break;
    // }
  };

  const getPlatformName = (platformId) => {
    const platforms = {
      1: "Android",
      2: "iOS",
      3: "Web",
    };

    return platforms[platformId] || "Unknown Platform";
  };

  const getModuleImage = (module) => {
    switch (module) {
      case 1:
        return channelImage;
      case 2:
        return projectImage;
      case 3:
        return taskImage;
      case 4:
        return chatImage;
      case 5:
        return alertImage;
      default:
        break;
    }
  };
  // function for get platform
  const getPlatform = (platform) => {
    switch (platform) {
      case 1:
        return "Android";
      case 2:
        return "IOS";
      case 3:
        return "Web";
      default:
        break;
    }
  };
  // function for get module
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
        break;
    }
  };

  const formatTag = (tagOption) => {
    if (tagOption === "featurerequest") {
      return "Feature Request";
    }
    return tagOption.charAt(0).toUpperCase() + tagOption.slice(1);
  };

  return (
    <div
      className="d-flex flex-column justify-content-between align-items-center"
      style={{ backgroundColor: "#383D48", height: "fit-content" }}
    >
      <div
        className="p-4 my-4 w-75"
        style={{
          // backgroundColor: "#1e3b6e",
          borderRadius: "10px",
        }}
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
              <div>
                <p className="text-start" style={{ fontWeight: "bold" }}>
                  {feedback.title}
                </p>
                <p className="text-start">{feedback.description}</p>
              </div>

              <div
                style={{ position: "absolute", bottom: "25px", right: "60px" }}
              >
                <div
                  className="border border-warning rounded p-3"
                  style={{ width: "80px", textAlign: "center" }}
                >
                  <div className="mb-2"></div>
                  <div>
                    <span className="fw-bold">40</span>
                    <p className="mb-0">Votes</p>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center mt-2">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    marginRight: "5px",
                    marginLeft: "10px",
                    padding: "5px 10px",
                    border: `1px solid ${getTagColor(feedback.tags)}`,
                    borderRadius: "10px",
                    color: getTagColor(feedback.tags),
                    backgroundColor: "transparent",
                  }}
                >
                  <Image
                    src={getTagImage(feedback.tags)}
                    style={{
                      marginRight: "5px",
                      width: "18px",
                      height: "18px",
                      objectFit: "contain",
                    }}
                  />
                  {feedback.tags}
                </span>

                {/* <span
                  style={{
                    padding: "5px 10px",
                    border: "1px solid #E49A2C",
                    borderRadius: "10px",
                    color: "#E49A2C",
                    backgroundColor: "transparent",
                    marginRight: "10px",
                  }}
                >
                  <Image
                    src={getPlatformImage(feedback.platform)}
                    style={{
                      marginRight: "5px",
                      width: "18px",
                      height: "18px",
                    }}
                  />
                  {getPlatform(feedback.platform)}
                </span> */}

                {feedback.platform.split(",").map((platformId, index) => {
                  console.log(platformId, "platformId");

                  const platformImage = getPlatformImage(platformId);
                  const platformName = getPlatformName(platformId);
                  console.log(
                    platformName,
                    "platformName",
                    platformImage,
                    "platformImage"
                  );

                  return (
                    <span
                      key={index}
                      style={{
                        padding: "5px 10px",
                        border: "1px solid #E49A2C",
                        borderRadius: "10px",
                        color: "#E49A2C",
                        backgroundColor: "transparent",
                        marginRight: "10px",
                      }}
                    >
                      <Image
                        src={platformImage}
                        alt={platformName}
                        style={{
                          marginRight: "5px",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                      {platformName}
                    </span>
                  );
                })}

                <span
                  style={{
                    padding: "5px 10px",
                    border: "1px solid #FFDD09",
                    borderRadius: "10px",
                    color: "#FFDD09",
                    backgroundColor: "transparent",
                  }}
                >
                  <Image
                    src={getModuleImage(feedback.module)}
                    style={{
                      marginRight: "5px",
                      width: "18px",
                      height: "18px",
                    }}
                  />

                  {getModule(feedback.module)}
                </span>
              </div>
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <IconButton
                  onClick={handleClick}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <FaEllipsisV style={{ color: "white", fontSize: "18px" }} />
                </IconButton>

                <Popover
                  id={`popover-${feedback.id}`}
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClickClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  PaperProps={{
                    style: {
                      backgroundColor: "#1C2437",
                      color: "white",
                      border: "1px solid white",
                    },
                  }}
                >
                  <List>
                    <ListItem
                      button
                      onClick={() => getFeedbackById(feedback.id)}
                    >
                      <Image
                        src={editImage}
                        style={{
                          marginRight: "10px",
                          width: "18px",
                          height: "18px",
                          objectFit: "contain",
                        }}
                      />
                      <ListItemText primary="Edit List" />
                    </ListItem>
                    <ListItem
                      button
                      onClick={() => handleDeleteConfirm(feedback.id)}
                    >
                      <Image
                        src={deleteImage}
                        style={{
                          marginRight: "10px",
                          width: "18px",
                          height: "18px",
                          objectFit: "contain",
                        }}
                      />
                      <ListItemText primary="Delete List" />
                    </ListItem>
                  </List>
                </Popover>
              </div>
            </div>
          ))
        ) : (
          <div className="text-white mt-3 text-center">
            No feedbacks available.
          </div>
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

      {/* Feed Bakc Modal */}

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header style={{ backgroundColor: "#121825" }}>
          <Modal.Title className="text-white d-flex justify-content-center w-100 align-items-center">
            Bug Report
          </Modal.Title>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={handleClose}
            aria-label="Close"
            style={{
              color: "white",
              position: "absolute",
              right: "25px",
              top: "25px",
            }}
          ></button>
        </Modal.Header>

        <Modal.Body style={{ backgroundColor: "#121825" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-white">
                <Image
                  src={titleImage}
                  alt="Title Image"
                  style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "contain",
                  }}
                />{" "}
                Title
              </Form.Label>
              <Form.Control
                name="title"
                id="title"
                type="text"
                style={{
                  backgroundColor: "#455577",
                  borderColor: "#121825",
                  color: "white",
                }}
                className="placeholder-white"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <p className="text-danger">{errors.title}</p>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-white">
                <Image
                  src={platformImage}
                  alt="Platform Image"
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "contain",
                  }}
                />{" "}
                Platform
              </Form.Label>
              <Select
                isMulti
                options={[
                  { value: "1", label: "Android" },
                  { value: "2", label: "iOS" },
                  { value: "3", label: "Web" },
                ]}
                value={platform.map((val) => ({
                  value: val,
                  label: getLabel(val),
                }))}
                onChange={(selectedOptions) =>
                  setPlatform(selectedOptions.map((option) => option.value))
                }
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    backgroundColor: "#455577",
                    borderColor: "#121825",
                    color: "white",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: "#455577",
                    color: "white",
                  }),
                }}
              />
              {errors.platform && (
                <p className="text-danger">{errors.platform}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-white">
                {" "}
                <Image
                  src={moduleImage}
                  alt="Module Image"
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "5px",
                    objectFit: "contain",
                  }}
                />{" "}
                Module
              </Form.Label>
              <Form.Control
                as="select"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                style={{ backgroundColor: "#455577", borderColor: "#121825" }}
              >
                <option>Select The Module</option>
                <option value="1">Channel</option>
                <option value="2">Project</option>
                <option value="3">Task</option>
                <option value="4">Chat</option>
                <option value="5">Alert</option>
              </Form.Control>
              {errors.module && <p className="text-danger">{errors.module}</p>}
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="text-white">
                <Image
                  src={descriptionImage}
                  alt="Description Image"
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "contain",
                  }}
                />{" "}
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Add a additional details"
                name="description"
                className="placeholder-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ backgroundColor: "#455577", borderColor: "#121825" ,color:"white"}}
              />
              {errors.description && (
                <p className="text-danger">{errors.description}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white">
                <Image
                  src={attachmentImage}
                  alt="Attachment Image"
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "contain",
                  }}
                />{" "}
                Attachments (optional)
              </Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                className="placeholder-white"
                style={{ backgroundColor: "#455577", borderColor: "#121825" }}
                placeholder="Upload Attachment"
              />
              {attachment && (
                <div
                  className="mt-2 text-white"
                  style={{ position: "relative" }}
                >
                  {attachment &&
                  typeof attachment === "string" &&
                  attachment.startsWith("http") ? (
                    <div>
                      <Image
                        src={attachment}
                        alt="preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                        }}
                      />
                      <FaTimes
                        onClick={() => setAttachment(null)}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          cursor: "pointer",
                          color: "#FFDD09",
                        }}
                      />
                    </div>
                  ) : attachment.type && attachment.type.startsWith("image") ? (
                    <div>
                      <Image
                        src={URL.createObjectURL(attachment)}
                        alt="preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                        }}
                      />
                      <FaTimes
                        onClick={() => setAttachment(null)}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          cursor: "pointer",
                          color: "#FFDD09",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between">
                      <p>{attachment.name}</p>
                      <FaTimes
                        onClick={() => setAttachment(null)}
                        style={{
                          cursor: "pointer",
                          color: "#FFDD09",
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white">
                <Image
                  src={tagImage}
                  alt="Tag Image"
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "contain",
                  }}
                />{" "}
                Tag
              </Form.Label>

              {/* <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {tags.map((tag, index) => (
          <span
            key={index}
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginRight: "10px",
              padding: "5px 10px",
              border: `1px solid ${getTagColor(tag)}`,
              borderRadius: "10px",
              color: getTagColor(tag),
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleTagClick(index)}
          >
            {editingTagIndex === index ? (
              <input
                type="text"
                value={editedTagValue}
                onChange={handleTagChange}
                onBlur={handleSaveTag} 
                style={{
                  backgroundColor: "#455577",
                  border: "1px solid #121825",
                  color: "white",
                  padding: "5px",
                  borderRadius: "10px",
                }}
                autoFocus
              />
            ) : (
              <>
                <FaTag style={{ marginRight: "5px", color: getTagColor(tag) }} />
                {tag}
              </>
            )}
          </span>
        ))}
      </div> */}

              <Dropdown onSelect={(selectedTag) => setTag(selectedTag)}>
                <Dropdown.Toggle
                  style={{
                    backgroundColor: "#455577",
                    borderColor: "#121825",
                    color: tag ? getTagColor(tag) : "#121825",
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  id="dropdown-tags"
                >
                  {tag ? (
                    <>
                      <FaTag
                        style={{ marginRight: "5px", color: getTagColor(tag) }}
                      />
                      <span style={{ marginLeft: "5px" }}>
                        {formatTag(tag)}
                      </span>
                    </>
                  ) : (
                    "Select Tag"
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {["feedback", "bug", "idea", "featurerequest"].map(
                    (tagOption) => (
                      <Dropdown.Item key={tagOption} eventKey={tagOption}>
                        <span style={{ color: getTagColor(tagOption) }}>
                          {tagOption === "feedback" && <FaComment />}
                          {tagOption === "bug" && <FaBug />}
                          {tagOption === "idea" && <FaLightbulb />}
                          {tagOption === "featurerequest" && <FaCog />}
                          {formatTag(tagOption)}
                        </span>
                      </Dropdown.Item>
                    )
                  )}
                </Dropdown.Menu>
              </Dropdown>
              {errors.tag && <p className="text-danger">{errors.tag}</p>}
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer
          style={{ backgroundColor: "#121825" }}
          className="d-flex justify-content-center"
        >
          <Button
            variant="warning"
            onClick={() => handleSubmit(feedbackId)}
            className=" align-items-center"
            style={{ width: "300px" }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete COnfirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteClose} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#121825" }}>
          <Modal.Title className="text-white d-flex align-items-center">
            Delete Confirmation
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ backgroundColor: "#121825" }}>
          <p className="text-white">
            Are you sure you want to delete this item?
          </p>
        </Modal.Body>

        <Modal.Footer style={{ backgroundColor: "#121825" }}>
          <Button
            variant="secondary"
            onClick={handleDeleteClose}
            style={{ backgroundColor: "#6c757d", border: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            style={{ backgroundColor: "#dc3545", border: "none" }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
