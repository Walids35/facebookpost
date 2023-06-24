import { Image } from "react-bootstrap";

const ImageCard = ({index, image, handleImageDelete}) => {

  if (image.loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div key={index} className="p-2 d-flex justify-content-between mt-2">
        <div className="d-flex">
          <Image src="three-dots-vertical.svg" className="me-3" />
          <Image src={image.url} className="me-3" style={{ width: "50px" }} />
          <div>
            <div className="ms-2" style={{ fontSize: "12px", width: "400px" }}>
              {image.url.slice(0, 100) + "....."}
            </div>
          </div>
        </div>
        <button type="button" onClick={() => handleImageDelete(index)}>
          <Image src="trash3-fill.svg" />
        </button>
      </div>
    </>
  );
};

export default ImageCard;
