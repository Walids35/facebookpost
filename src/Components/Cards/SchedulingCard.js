import Card from "react-bootstrap/Card";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

const SchedulingCard = ({scheduling, setScheduling, setScheduleDate, setScheduleTime}) => {
    const handleScheduling = (e) => {
        setScheduling(e.currentTarget.value);
        console.log(scheduling);
      };

  return (
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
                      variant="light"
                    >
                      Publish Now
                    </ToggleButton>
                    <ToggleButton
                      onChange={handleScheduling}
                      className="toggle"
                      id="tbg-radio-2"
                      value="Schedule"
                      variant="light"
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
  )
}

export default SchedulingCard