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

function App() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [postTo, setPostTo] = useState("");
  const [imageurl, setImage] = useState("");
  const [textGeneration, setTextGeneration] = useState("");
  const [imageGeneration, setImageGeneration] = useState("");
  const [postText, setPostText] = useState("");
  const [scheduling, setScheduling] = useState("Publish");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const ACCESS_TOKEN = "EAADtpk8ZCkPEBAPxZAqVZAZBpdHxk0HU3DQZCZBovAGA5tu51PNSqKunMxYwREfzrUbU3s84v6iwty4SKINFWGhgx2nlVBFqq7k02pFJjZCxhqZCPKK4I5J77YSNkWZA1NlhNAZCmWHUgBN7nKvpuARJGS5BRuRcQDkRrzswlGzCbPSf915WUZBVWdL473KzpP3vT6p5yHRUcJslecXBHL20esw";
  const PAGE_ID = "109960688796992";
  const URL_ENDPOINT = `https://graph.facebook.com/${PAGE_ID}/photos`;
  const SCHEDULE_ENDPOINT = `https://graph.facebook.com/${PAGE_ID}/photos/feed`;

  async function submitSchedulePost(pageAccessToken, message, photoUrl, timeStamp){
    try{
      const response = await fetch (SCHEDULE_ENDPOINT, {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: photoUrl,
          access_token: pageAccessToken,
          message: message,
          published: false,
          scheduled_publish_time: timeStamp
        }),
      });

      const reponseData = await response.json();
      console.log(reponseData);
    }catch(error){
      console.log(error)
    }
  } 


  async function submitPublishPost(pageAccessToken, message, photoUrl) {
    try {
      const response = await fetch(URL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: photoUrl,
          caption: message,
          access_token: pageAccessToken,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.log(error);
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
        setSelectedImages([...selectedImages, data.data[0].url])
        setImageGeneration("")
      });
  }

  const handleScheduling = (e) => {
    setScheduling(e.currentTarget.value);
    console.log(scheduling);
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    const imageArray = Array.from(files).slice(0, 10); // Limit to maximum of 10 images

    const imageUrls = imageArray.map((file) => URL.createObjectURL(file));
    setSelectedImages(imageUrls);
    console.log(selectedImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //Create a Post Object
    const newPost = {
      postTo,
      selectedImages,
      postText,
      scheduling,
    };

    if(scheduling === "Publish"){
      submitPublishPost(ACCESS_TOKEN, newPost.postText, selectedImages[0]);
    }
    if (scheduling === "Schedule") {
      newPost.scheduleDate = scheduleDate;
      newPost.scheduleTime = scheduleTime;
      const date = newPost.scheduleDate + " " + newPost.scheduleTime
      const timestamp = convertToTimestamp(date)
      newPost.timeStamp = timestamp
      submitPublishPost(ACCESS_TOKEN, newPost.postText, selectedImages[0], "1687176458")
    }

    console.log("New Post:", newPost);
  };

  function convertToTimestamp(dateString) {
    var parts = dateString.split(' ');
    var dateParts = parts[0].split('/');
    var day = parseInt(dateParts[0], 10);
    var month = parseInt(dateParts[1], 10) - 1;
    var year = parseInt(dateParts[2], 10);
    var timeParts = parts[1].split(':');
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);
    var dateObj = new Date(year, month, day, hours, minutes);
    return dateObj.getTime();
  }

  const handlePostTo = (e) => {
    setPostTo(e.currentTarget.value);
    console.log(postTo);
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
                    defaultValue="facebookpage"
                  >
                    <option value="facebookpage">Facebook Page</option>
                    <option value="instagrampage">Instagram Page</option>
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
                    Add Images
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
              </Card.Body>
            </Card>
            {/**Post Details */}
            <Card className="mt-3">
              <Card.Body>
                <Card.Title>Post Details</Card.Title>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Generate Text"
                    onClick={(e) => setTextGeneration(e.currentTarget.value)}
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
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Generate Image"
                    onChange={(e) => setImageGeneration(e.currentTarget.value)}
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
