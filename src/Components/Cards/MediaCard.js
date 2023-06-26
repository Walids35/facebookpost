import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AlertError from "../AlertError";
import {
    ref,
    uploadBytes,
    getDownloadURL
  } from "firebase/storage";
  import { storage } from "../../firebase";
import { v4 } from "uuid";
import ImageCard from "../ImageCard";

const MediaCard = ({postTo, setSelectedImages, selectedImages, imageUpload, setImageUpload, verifyMedias}) => {
  console.log(selectedImages)
  const uploadFile = () => {
    if (imageUpload.length > 0) {
      imageUpload.forEach((file) => {
        const imageRef = ref(storage, `images/${file.name + v4()}`);
        const newImage = {
          url: '',
          loading: true,
        };
        setSelectedImages((prev) => [...prev, newImage]);
        uploadBytes(imageRef, file)
          .then((snapshot) => {
            console.log(snapshot);
            getDownloadURL(snapshot.ref).then((url) => {
              const previousImages = [...selectedImages]
              previousImages[previousImages.length] = {url : url, loading: false}
              setSelectedImages(previousImages)
            });
          })
      });
      setImageUpload([]);
    }
  };

  async function handleImageChange(event) {
    const files = event.target.files;
    const imageArray = Array.from(files);
    imageArray.forEach((file) => {
      setImageUpload((prev) => [...prev, file]);
    });
  }

  async function handleImageDelete(index) {
    const updatedArray = selectedImages.filter((_, i) => i !== index);
    await timeout(50);
    setSelectedImages(updatedArray);
  }

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  return (
    <Card className="mt-3">
              <Card.Body>
                <Card.Title>Media</Card.Title>
                <Card.Text>
                  Share photos or a video. Instagram posts can't exceed 10
                  photos.
                </Card.Text>
                {(selectedImages.length > 0 && verifyMedias() === true) && <AlertError />}
                {imageUpload.length > 0 && (
                  <div style={{ fontSize: "12px" }}>
                    Images were Added - Please click on the upload button
                  </div>
                )}
                <Form.Group controlId="exampleForm.ControlInput1">
                  <label htmlFor="image-upload" className="btn btn-dark">
                    {postTo === "photos" ? <> Add Images</> : <>Add Video</>}
                    <input
                      id="image-upload"
                      type="file"
                      accept={postTo === "photos" ? "image/*" : "video/*"}
                      onChange={(e) => handleImageChange(e)}
                      multiple
                      style={{ display: "none" }}
                    />
                  </label>
                  <Button variant="light" onClick={uploadFile}>
                    Upload
                  </Button>
                </Form.Group>
                {selectedImages.length > 0 &&
                  selectedImages.map((image, index) => {
                    return <ImageCard index={index} image={image} handleImageDelete={handleImageDelete} />
                  })}
              </Card.Body>
            </Card>
  )
}

export default MediaCard