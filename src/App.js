import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import "./Styling/App.css";
import FacebookPreview from "./Components/FacebookPreview";
import axios from "axios";
import PostToCard from "./Components/Cards/PostToCard";
import MediaCard from "./Components/Cards/MediaCard";
import config from "./config/config";
import PostDetails from "./Components/Cards/PostDetails";
import SchedulingCard from "./Components/Cards/SchedulingCard";

function App() {
  const [imageUpload, setImageUpload] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [postTo, setPostTo] = useState("photos");
  const [textGeneration, setTextGeneration] = useState("");
  const [imageGeneration, setImageGeneration] = useState("");
  const [postText, setPostText] = useState("");
  const [scheduling, setScheduling] = useState("Publish");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");

  async function schedulePost(
    pageAccessToken,
    message,
    pictureUrls,
    scheduledTime
  ) {
    const apiUrl = `https://graph.facebook.com/${config.PAGE_ID}/photos`;

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
              url: url.url,
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
      const postUrl = `https://graph.facebook.com/${config.PAGE_ID}/feed`;
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
    const apiUrl = `https://graph.facebook.com/${config.PAGE_ID}/photos`;

    // Step 3: Prepare the post data
    const postData = {
      message: message,
      access_token: pageAccessToken,
    };

    const mediaIds = await Promise.all(
      pictureUrls.map(async (url) => {
        try {
          console.log(url);
          const response = await axios.post(apiUrl, {
            url: url.url,
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

try{
      // Step 5: Create the post with attached media
      const postUrl = `https://graph.facebook.com/${config.PAGE_ID}/feed`;
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
    const API_URL = `https://graph.facebook.com/${config.PAGE_ID}/videos`;

    const PostData = {
      description: message,
      access_token: pageAccessToken,
      published: true,
      file_url: videoURL.url,
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

  async function scheduleVideo(
    pageAccessToken,
    message,
    videoURL,
    scheduledTime
  ) {
    const API_URL = `https://graph.facebook.com/${config.PAGE_ID}/videos`;

    const PostData = {
      description: message,
      access_token: pageAccessToken,
      file_url: videoURL.url,
      published: false,
      scheduled_publish_time: scheduledTime,
    };

    try {
      const formData = new FormData();
      formData.append("description", PostData.description);
      formData.append("access_token", PostData.access_token);
      formData.append("file_url", PostData.file_url);
      formData.append("published", PostData.published);
      formData.append(
        "scheduled_publish_time",
        PostData.scheduled_publish_time
      );

      const response = await axios.post(API_URL, formData);

      console.log("Successfully Scheduled a post with a video", response.data);
    } catch (e) {
      console.log({ error: e });
    }
  }

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
        publishPost(config.ACCESS_TOKEN, newPost.postText, newPost.selectedImages);
      }
      if (scheduling === "Schedule") {
        newPost.scheduleDate = scheduleDate;
        newPost.scheduleTime = scheduleTime;
        const date = newPost.scheduleDate + " " + newPost.scheduleTime;
        const timestamp = convertToTimestamp(date);
        newPost.timeStamp = timestamp;
        schedulePost(
          config.ACCESS_TOKEN,
          newPost.postText,
          newPost.selectedImages,
          newPost.timeStamp
        );
      }
    } else {
      if (scheduling === "Publish") {
        publishVideo(config.ACCESS_TOKEN, newPost.postText, newPost.selectedImages[0]);
      } else {
        const date = scheduleDate + " " + scheduleTime;
        const timestamp = convertToTimestamp(date);
        newPost.timeStamp = timestamp;
        scheduleVideo(
          config.ACCESS_TOKEN,
          newPost.postText,
          newPost.selectedImages[0],
          newPost.timeStamp
        );
      }
    }

    setImageGeneration("");
    setPostText("");
    setImageUpload([]);
    setSelectedImages([]);
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

  function isVideoUrl() {
    return selectedImages.some((image) => {
      return image.url.includes('.mp4') || image.url.includes('.mov');
    });
  }

  function isImageUrl(){
    return selectedImages.some((image) => {
      return image.url.includes('.png') || image.url.includes('.jpg') || image.url.includes('.jpeg');
    })
  }

  function verifyMedias() {
    if (postTo === 'photos' && isVideoUrl()) {
      return true;
    }
    if(postTo === 'video' && isImageUrl()){
      return true;
    }
    return false
  }

  return (
    <div className="p-5 bg-grey">
      <h4>Create Post</h4>
      <Row>
        {/*Left Column*/}
        <Col className="mt-3" sm={6}>
          {/**Post To Card */}
          <form noValidate onSubmit={handleSubmit}>
            <PostToCard postTo={postTo} handlePostTo={handlePostTo} />
            {/**Media Card */}
            <MediaCard postTo={postTo} setSelectedImages={setSelectedImages} selectedImages={selectedImages} imageUpload={imageUpload} setImageUpload={setImageUpload} verifyMedias={verifyMedias}/>
            {/**Post Details */}
            <PostDetails postTo={postTo} postText={postText} setPostText={setPostText} imageGeneration={imageGeneration} setImageGeneration={setImageGeneration} textGeneration={textGeneration} setTextGeneration={setTextGeneration} selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
            {/**Publish options */}
            <SchedulingCard scheduling={scheduling} setScheduling={setScheduling} setScheduleDate={setScheduleDate} setScheduleTime={setScheduleTime} />
            {/**Call To action Card */}
            <Card className="mt-3">
              <Card.Body>
                <div className="d-flex justify-content-end gap-2">
                  <Button variant="light">Cancel</Button>
                  <Button variant="dark" onClick={handleSubmit} disabled={verifyMedias()}>
                    Submit
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </form>
        </Col>
        {/**Right Column */}
        <Col sm={6}>
          <div
            className="py-4"
            style={{ paddingLeft: "100px", paddingRight: "100px" }}
          >
            <h5>Facebook Feed preview</h5>
            <FacebookPreview
              postText={postText}
              postImages={selectedImages}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
