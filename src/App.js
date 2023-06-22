import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import InputGroup from "react-bootstrap/InputGroup";
import { useState } from "react";
import "./Styling/App.css";
import FacebookPreview from "./Components/FacebookPreview";
import {Image} from "react-bootstrap";
import { Alert } from "react-bootstrap";
import axios from "axios";

function App() {
  const [selectedImages, setSelectedImages] = useState([
  ]);
  const [postTo, setPostTo] = useState("photos");
  const [textGeneration, setTextGeneration] = useState("");
  const [imageGeneration, setImageGeneration] = useState("");
  const [postText, setPostText] = useState("");
  const [scheduling, setScheduling] = useState("Publish");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const ACCESS_TOKEN =
    "EAADtpk8ZCkPEBAEzYbgJjemvucWFbLyGi4igwUoJwlKcWgvSGZAzwCHxBLSEkLSPo3sds7K2AFxofzijrPQoAAJZCRA6OdpdCgvQMZBpnwZB0r2ejW11UmWUv5SMuI6FQk5rDsUtZAEbmJMioKN8ZBovzR2DM15UPkMU9ZBmAox9ATjMDJrn6ZBzigGUhEfOGrulbe8spz67cZBlHN9lgOOGOa";
  const PAGE_ID = "109960688796992";

  async function schedulePost(pageAccessToken,message,pictureUrls,scheduledTime) {
    const apiUrl = `https://graph.facebook.com/${PAGE_ID}/photos`;

    // Step 3: Prepare the post data
    const postData = {
      message: message,
      scheduled_publish_time: Math.floor(scheduledTime),
      published: false,
      access_token: pageAccessToken,
    };

    try {
      // Step 4: Upload the pictures and get their media IDs
      const mediaIds = await Promise.all(
        pictureUrls.map(async (url) => {
          try {
            console.log(url);
            const response = await axios.post(apiUrl, {
              url: url,
              published: false,
              access_token: pageAccessToken,
            });

            if (response.status !== 200) {
              throw new Error("Failed to upload picture");
            }

            return response.data.id;
          } catch (error) {
            throw new Error(`Failed to upload picture: ${error.message}`);
          }
        })
      );
      console.log(mediaIds);
      // Step 5: Create the post with attached media
      const postUrl = `https://graph.facebook.com/${PAGE_ID}/feed`;
      const formData = new FormData();
      formData.append("message", postData.message);
      formData.append(
        "scheduled_publish_time",
        postData.scheduled_publish_time
      );
      formData.append("published", postData.published);
      formData.append("access_token", postData.access_token);
      mediaIds.forEach((mediaId, index) => {
        formData.append(
          `attached_media[${index}]`,
          `{"media_fbid":"${mediaId}"}`
        );
      });
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      // Step 6: Send the POST request to schedule the post
      const response = await axios.post(postUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to schedule post");
      }

      console.log("Post scheduled successfully:", response.data);
    } catch (error) {
      console.error("Error scheduling post:", error);
    }
  }

  async function publishPost(pageAccessToken, message, pictureUrls) {
    const apiUrl = `https://graph.facebook.com/${PAGE_ID}/photos`;

    // Step 3: Prepare the post data
    const postData = {
      message: message,
      access_token: pageAccessToken,
    };

    try {
      // Step 4: Upload the pictures and get their media IDs
      const mediaIds = await Promise.all(
        pictureUrls.map(async (url) => {
          try {
            console.log(url);
            const response = await axios.post(apiUrl, {
              url: url,
              published: false,
              access_token: pageAccessToken,
            });

            if (response.status !== 200) {
              throw new Error("Failed to upload picture");
            }

            return response.data.id;
          } catch (error) {
            throw new Error(`Failed to upload picture: ${error.message}`);
          }
        })
      );

      // Step 5: Create the post with attached media
      const postUrl = `https://graph.facebook.com/${PAGE_ID}/feed`;
      const formData = new FormData();
      formData.append("message", postData.message);
      formData.append("access_token", postData.access_token);
      mediaIds.forEach((mediaId, index) => {
        formData.append(
          `attached_media[${index}]`,
          `{"media_fbid":"${mediaId}"}`
        );
      });
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      // Step 6: Send the POST request to schedule the post
      const response = await axios.post(postUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to schedule post");
      }

      console.log("Post scheduled successfully:", response.data);
    } catch (error) {
      console.error("Error scheduling post:", error);
    }
  }

  async function publishVideo(pageAccessToken, message, videoURL) {
    const API_URL = `https://graph.facebook.com/${PAGE_ID}/videos`;

    const PostData = {
      description: message,
      access_token: pageAccessToken,
      published: true,
      file_url: videoURL,
    };
    console.log(PostData);
    try {
      const formData = new FormData();
      formData.append("description", PostData.description);
      formData.append("access_token", PostData.access_token);
      formData.append("file_url", PostData.file_url);

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(API_URL, formData);

      console.log("Post scheduled successfully:", response.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function scheduleVideo(pageAccessToken, message, videoURL, scheduledTime){
    const API_URL = `https://graph.facebook.com/${PAGE_ID}/videos`

    const PostData = {
      description: message,
      access_token: pageAccessToken,
      file_url: videoURL,
      published: false,
      scheduled_publish_time: scheduledTime
    }

    try{
      const formData = new FormData()
      formData.append("description", PostData.description)
      formData.append("access_token", PostData.access_token)
      formData.append("file_url", PostData.file_url)
      formData.append("published",PostData.published)
      formData.append("scheduled_publish_time", PostData.scheduled_publish_time)

      const response = await axios.post(API_URL, formData)

      console.log("Successfully Scheduled a post with a video", response.data)
    }catch(e){
      console.log({error: e})
    }
  }

  function generatetext() {
    try {
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: textGeneration }],
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data.choices[0].message.content);
          setPostText(data.choices[0].message.content);
          setTextGeneration("");
        });
    } catch (err) {
      console.log(err);
    }
  }

  function generateimage() {
    fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      body: JSON.stringify({
        prompt: imageGeneration,
        n: 1,
        size: "1024x1024",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data.data[0].url);
        setSelectedImages([...selectedImages, data.data[0].url]);
        setImageGeneration("");
      });
  }

  const handleImageChange = (event) => {
    const files = event.target.files;
    const imageArray = Array.from(files).slice(0, 10); // Limit to maximum of 10 images

    const imageUrls = imageArray.map((file) => URL.createObjectURL(file));
    setSelectedImages(imageUrls);
    console.log(selectedImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      postTo,
      selectedImages,
      postText,
      scheduling,
    };

    if (postTo === "photos") {
      if (scheduling === "Publish") {
        publishPost(ACCESS_TOKEN, newPost.postText, newPost.selectedImages);
      }
      if (scheduling === "Schedule") {
        newPost.scheduleDate = scheduleDate;
        newPost.scheduleTime = scheduleTime;
        const date = newPost.scheduleDate + " " + newPost.scheduleTime;
        const timestamp = convertToTimestamp(date);
        newPost.timeStamp = timestamp;
        schedulePost(
          ACCESS_TOKEN,
          newPost.postText,
          newPost.selectedImages,
          newPost.timeStamp
        );
      }
    } else {
      if(scheduling === "Publish"){
        publishVideo(ACCESS_TOKEN, newPost.postText, newPost.selectedImages[0]);
      }else{
        const date = scheduleDate + " " + scheduleTime;
        const timestamp = convertToTimestamp(date)
        newPost.timeStamp = timestamp;
        scheduleVideo(ACCESS_TOKEN, newPost.postText, newPost.selectedImages[0], newPost.timeStamp)
      }
      
      
    }

    setPostText("")
    setSelectedImages([])
    console.log("New Post:", newPost);
  };

  function convertToTimestamp(dateString) {
    var parts = dateString.split(" ");
    var dateParts = parts[0].split("/");
    var day = parseInt(dateParts[0], 10);
    var month = parseInt(dateParts[1], 10) - 1;
    var year = parseInt(dateParts[2], 10);
    var timeParts = parts[1].split(":");
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);
    var dateObj = new Date(year, month, day, hours, minutes);
    return dateObj.getTime() / 1000;
  }

  const handlePostTo = (e) => {
    setPostTo(e.currentTarget.value);
    console.log(postTo);
  };

  const handleScheduling = (e) => {
    setScheduling(e.currentTarget.value);
    console.log(scheduling);
  };

  return (
    <div className="p-5 bg-grey">
      <h4>Create Post</h4>
      <Row>
        {/*Left Column*/}
        <Col className="mt-3" sm={6}>
          {/**Post To Card */}
          <Form noValidate onSubmit={handleSubmit}>
            <Card>
              <Card.Body>
                <Card.Title>Post To</Card.Title>
                <Form.Group controlId="exampleForm.SelectCustom">
                  <Form.Label>Select an option:</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={handlePostTo}
                    value={postTo}
                  >
                    <option value="photos">Post one or multiple photos</option>
                    <option value="video">Post a video</option>
                  </Form.Control>
                </Form.Group>
              </Card.Body>
            </Card>
            {/**Media Card */}
            <Card className="mt-3">
              <Card.Body>
                <Card.Title>Media</Card.Title>
                <Card.Text>
                  Share photos or a video. Instagram posts can't exceed 10
                  photos.
                </Card.Text>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <label htmlFor="image-upload" className="btn btn-dark">
                    {postTo === "photos" ? (<>Add Images</>) : (<>Add Video</>)}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*, video/*"
                      multiple
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </Form.Group>
                {selectedImages.length > 0 && (
                  selectedImages.map((image, index) => {
                    return (
                    <>
                      <div key={index} className="p-2 d-flex justify-content-between align-items-baseline mt-1">
                        <div className="d-flex">
                        <Image src="three-dots-vertical.svg" />
                        <Image src={image} style={{width: "50px"}} />
                        <div className="ms-2" style={{fontSize:"12px"}}>{image}</div>
                        </div>
                        <button>
                          <Image src="trash3-fill.svg" />
                        </button>
                      </div>
                    </>
                    )
                  })
                )}
              </Card.Body>
            </Card>
            {/**Post Details */}
            <Card className="mt-3">
              <Card.Body>
                <Card.Title>Post Details</Card.Title>
                <Alert key="warning" variant="warning">
                  <Image src="exclamation-lg.svg" />New Feature: Generating Text and Image with AI
                </Alert>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Generate Text"
                    onChange={(e) => setTextGeneration(e.currentTarget.value)}
                    aria-label="Generate Text"
                    value={textGeneration}
                    aria-describedby="basic-addon2"
                  />
                  <Button
                    variant="outline-secondary"
                    id="button-addon2"
                    onClick={generatetext}
                  >
                    Generate
                  </Button>
                </InputGroup>
                {postTo === "photos" && (
                  <InputGroup className="mb-3">
                    <Form.Control
                      placeholder="Generate Image"
                      onChange={(e) =>
                        setImageGeneration(e.currentTarget.value)
                      }
                      value={imageGeneration}
                      aria-label="Generate Image"
                      aria-describedby="basic-addon2"
                    />
                    <Button
                      variant="outline-secondary"
                      id="button-addon2"
                      onClick={generateimage}
                    >
                      Generate
                    </Button>
                  </InputGroup>
                )}

                <Form.Group>
                  <Form.Label>Text</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={postText}
                    required
                    aria-label="With textarea"
                    onChange={(e) => setPostText(e.currentTarget.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
            {/**Publish options */}
            <Card className="mt-3">
              <Card.Body>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <Card.Title>Scheduling Options</Card.Title>
                  <ToggleButtonGroup
                    className="mt-2"
                    type="radio"
                    name="options"
                    defaultValue="Publish"
                  >
                    <ToggleButton
                      onChange={handleScheduling}
                      className="toggle"
                      id="tbg-radio-1"
                      value="Publish"
                    >
                      Publish Now
                    </ToggleButton>
                    <ToggleButton
                      onChange={handleScheduling}
                      className="toggle"
                      id="tbg-radio-2"
                      value="Schedule"
                    >
                      Schedule
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
                {scheduling === "Schedule" && (
                  <>
                    <div className="mt-2">
                      <p>
                        Schedule your post for the times when your audience is
                        most active, or manually select a date and time in the
                        future to publish your post.
                      </p>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>Date and Time</InputGroup.Text>
                        <Form.Control
                          aria-label="Date"
                          placeholder="DD/MM/YYYY"
                          onChange={(e) =>
                            setScheduleDate(e.currentTarget.value)
                          }
                        />
                        <Form.Control
                          aria-label="Time"
                          placeholder="00:00"
                          onChange={(e) =>
                            setScheduleTime(e.currentTarget.value)
                          }
                        />
                      </InputGroup>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
            {/**Call To action Card */}
            <Card className="mt-3">
              <Card.Body>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <Button>Cancel</Button>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Col>
        {/**Right Column */}
        <Col sm={6}>
          <div
            className="py-4"
            style={{ paddingLeft: "100px", paddingRight: "100px" }}
          >
            <h5>Facebook Feed preview</h5>
            <FacebookPreview postText={postText} postImages={selectedImages} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
