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
  const [textGeneration, setTextGeneration] = useState("");
  const [postText, setPostText] = useState("");
  const [scheduling, setScheduling] = useState("Publish");

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

    console.log("New Post:",newPost);

    setPostText("")
    setPostTo("")
    setSelectedImages([])
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
                  <Form.Control as="select" custom onChange={handlePostTo}>
                    <option value="">-- Select --</option>
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
                        />
                        <Form.Control aria-label="Time" placeholder="00:00" />
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
          <div className="py-4" style={{paddingLeft:"100px", paddingRight:"100px"}}>
            <h5>Facebook Feed preview</h5>
            <FacebookPreview />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
