import React from "react";
import { Card } from "react-bootstrap";
import { Image } from "react-bootstrap";
import Placeholder from "react-bootstrap/Placeholder";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const FacebookPreview = () => {
  return (
    <>
      <Card className="mt-3">
        <div className="px-4 py-3">
          <div className="d-flex">
            <Image
              className="border"
              src="google_icon_130924.png"
              roundedCircle
              style={{ height: "40px", width: "40px" }}
            />
            <div className="ms-2">
              <p className="fw-semibold">Fan Music Band</p>
              <p
                className="text-body-secondary "
                style={{ marginTop: "-20px", fontSize: "12px" }}
              >
                Just Now
              </p>
            </div>
          </div>
          <Placeholder as="p" animation="wave">
            <Placeholder size="xs" bg="secondary" xs={12} />
            <Placeholder size="xs" bg="secondary" xs={6} />
          </Placeholder>
        </div>

        <Image src="ImagePlaceholder.png" />
        <Row className="mt-3 mx-3">
          <Col>
            <div className="d-flex">
              <Image
                src="like.svg"
                style={{ width: "20px", height: "20px" }}
              ></Image>
              <p className="ms-2 text-body-secondary">Like</p>
            </div>
          </Col>
          <Col>
            <div className="d-flex">
              <Image
                src="comment.svg"
                style={{ width: "20px", height: "20px" }}
              ></Image>
              <p className="ms-2 text-body-secondary">Comment</p>
            </div>
          </Col>
          <Col>
            <div className="d-flex justify-content-end">
              <Image
                src="share.svg"
                style={{ width: "20px", height: "20px" }}
              ></Image>
              <p className="ms-2 text-body-secondary">Share</p>
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default FacebookPreview;
