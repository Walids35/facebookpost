import { Image } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import axios from "axios";

const PostDetails = ({ postTo, postText, setPostText, textGeneration, setTextGeneration, imageGeneration, setImageGeneration, selectedImages, setSelectedImages}) => {
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

  function generateMidjourneyImage(){
    const newImage = {
      url: "",
      loading:true
    }
    setSelectedImages((prev) => [...prev, newImage])
    const data = ({
      "prompt": imageGeneration
    });

    const config = {
      method: 'POST',
      maxBodyLength: Infinity,
      url: "https://api.midjourneyapi.io/v2/imagine",
      headers: {
        Authorization: "60058835-3747-45f8-97ec-cce064a931ee",
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios.request(config).then((response) => {
      setImageGeneration("")
      console.log(JSON.stringify(response.data))
      const previousImages = [...selectedImages]
      previousImages[-1] = {url: response.data.ImageUrl, loading: false}
      setSelectedImages(previousImages)
    }).catch((error) => {
      setSelectedImages(selectedImages.filter(e => e.url === ""))
      console.log("error :", error)
    })
  }

  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>Post Details</Card.Title>
        <Alert key="warning" variant="warning">
          <Image src="exclamation-lg.svg" />
          <span className="fw-semibold">New Feature:</span> Generate text and
          image with AI
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
              onChange={(e) => setImageGeneration(e.currentTarget.value)}
              value={imageGeneration}
              aria-label="Generate Image"
              aria-describedby="basic-addon2"
            />
            <Button
              variant="outline-secondary"
              id="button-addon2"
              onClick={generateMidjourneyImage}
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
  );
};

export default PostDetails;
