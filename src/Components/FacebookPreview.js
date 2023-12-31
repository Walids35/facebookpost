import React from "react";
import { Card } from "react-bootstrap";
import { Image } from "react-bootstrap";
import Placeholder from "react-bootstrap/Placeholder";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import usePageInfo from "../hooks/usePageInfo";

const FacebookPreview = ({ postText, postImages }) => {

  const { pageInfo, loading } = usePageInfo()

  if (loading) {
    return (<div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="sr-only"></span>
    </div>
  </div>)
  }
  return (
    <>
      <Card className="mt-3">
        <div className="px-4 py-3">
          <div className="d-flex">
            
            <Image
              className="border"
              src={pageInfo.url}
              roundedCircle
              style={{ height: "40px", width: "40px" }}
            />
            <div className="ms-2">
             <p className="fw-semibold">{pageInfo.name}</p>
              <p
                className="text-body-secondary "
                style={{ marginTop: "-20px", fontSize: "12px" }}
              >
                Just Now
              </p>
            </div>
          </div>
          {postText === "" ? (
            <Placeholder as="p" animation="wave">
              <Placeholder size="xs" bg="secondary" xs={12} />
              <Placeholder size="xs" bg="secondary" xs={6} />
            </Placeholder>
          ) : (
            <p>{postText}</p>
          )}
        </div>
        {postImages.length === 0 ? (
          <Image src="ImagePlaceholder.png" />
        ) : (
          <> {postImages[0].url.includes(".mp4") || postImages[0].url.includes(".mov") ? (
                  <iframe
                    class="embed-responsive-item"
                    src={postImages[0].url}
                    allowfullscreen
                  ></iframe>
                ) : (
                  <Image src={postImages[0].url} />
                )
              }
            <div className="text-light bg-black w-100 d-flex justify-content-center align-items-center" style={{height:"50px"}}>
              + {postImages.length - 1 }
            </div>
          </>
        )}

        <Row className="mt-3 mx-3">
          <Col>
            <div className="d-flex">
              <Image
                src="like.svg"
                style={{ width: "20px", height: "20px" }}
              ></Image>
              <p className="ms-2 text-body-secondary fw-medium">Like</p>
            </div>
          </Col>
          <Col>
            <div className="d-flex">
              <Image
                src="comment.svg"
                style={{ width: "20px", height: "20px" }}
              ></Image>
              <p className="ms-2 text-body-secondary fw-medium">Comment</p>
            </div>
          </Col>
          <Col>
            <div className="d-flex justify-content-end">
              <Image
                src="share.svg"
                style={{ width: "20px", height: "20px" }}
              ></Image>
              <p className="ms-2 text-body-secondary fw-medium">Share</p>
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default FacebookPreview;
