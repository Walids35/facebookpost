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
  const [imageurl, setImage] = useState("")
  const [textGeneration, setTextGeneration] = useState("");
  const [postText, setPostText] = useState("");
  const [scheduling, setScheduling] = useState("Publish");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const ACCESS_TOKEN = "EAADtpk8ZCkPEBAJ399KLVGsDHGjOZAQZB4HZB9qZCrViB5rQlh0uFweXtBN6HpcP2cJuuRQdfkzb5ZBUd3mqiSZCIWAFJZBHSd011QprK46bXZAEwGyn8XpiHodk8vDZCPP8XE0ttNrEH05P2ZAFKoGk1cjob1W4QzCZAYQefVM4ZChyNb4U24cIjIAnTpBo6YYBYl6udrtyh0xVh6TyMORbZBeSDi";
  const PAGE_ID = "109960688796992";
  const URL_ENDPOINT = `https://graph.facebook.com/${PAGE_ID}/photos`;
  const imageUrl = "https://scontent.ftun9-1.fna.fbcdn.net/v/t39.30808-6/353673556_102602579545760_1932371616570846199_n.jpg?stp=cp0_dst-jpg&_nc_cat=100&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_ohc=rOEPW8pLbeAAX-YzNxg&_nc_ht=scontent.ftun9-1.fna&oh=00_AfB_3eKaAjtjfxoKqgpxOVRSIQYwauAkQpW7AyY23YjtuQ&oe=64912058";

  async function submitPost(pageAccessToken, message, photoUrl) {
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


  function generatetext(){
    try{
    fetch('https://api.openai.com/v1/chat/completions',{
    method:'POST',
    headers:{
      "Content-Type": "application/json",
      "Authorization":  "Bearer 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"
    },
    body: JSON.stringify({

        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": input1.value}]

    })}).then (res =>{
    return (res.json())
  }).then ( data => {
    console.log(data.choices[0].message.content)
  })
}
catch(err) {
  console.log(err)
}

function generateimage(){
  fetch('https://api.openai.com/v1/images/generations',{
    method:"POST",
    headers:{
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body:JSON.stringify({
       "prompt": input2.value,
        "n": 1,
        "size": "1024x1024"
    })
  }).then(res => {
    return res.json()
  }).then (data => {
    
    console.log(data.data[0].url)
  })
}
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

    submitPost(ACCESS_TOKEN, newPost.postText, imageUrl)

    if (scheduling === "Schedule") {
      newPost.scheduleDate = scheduleDate;
      newPost.scheduleTime = scheduleTime;
    }

    console.log("New Post:", newPost);
  };

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
                  <Form.Control as="select" onChange={handlePostTo} value={postTo} defaultValue="facebookpage">
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
                    placeholder="Generate Text and Image"
                    aria-label="Generate Text and Image"
                    aria-describedby="basic-addon2" 
                  />
                  <Button variant="outline-secondary" id="button-addon2">
                    Generate
                  </Button>
                </InputGroup>
                <Form.Group>
                  <Form.Label>Text</Form.Label>
                  <Form.Control
                    as="textarea"
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
