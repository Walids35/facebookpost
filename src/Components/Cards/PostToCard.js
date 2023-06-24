import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

const PostToCard = ({postTo, handlePostTo}) => {

  return (
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
  )
}

export default PostToCard