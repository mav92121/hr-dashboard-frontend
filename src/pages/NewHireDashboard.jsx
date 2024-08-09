import React from "react";
import TaskList from "../components/TaskList";
import { Container, Typography } from "@mui/material";
import { Row, Col, Divider } from "antd";

function NewHireDashboard({ user }) {
  const calculateDaysLeft = () => {
    const userDate = user.date;
    const userDateObj = new Date(userDate);
    const currDate = new Date();
    currDate.setHours(0, 0, 0, 0);
    const timeDifference = userDateObj - currDate;
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysLeft;
  };
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };
  return (
    <>
      <Container className="flex items-center mt-4">
        <Typography className=" " gutterBottom>
          <Row className="w-full">
            <Col className=" flex flex-col justify-center" span={16}>
              <Row>
                <h1 className="  px-4  font-bold text-2xl">
                  Hello, {user.name}!
                </h1>
              </Row>
              <Row>
                <p className=" px-4">
                  Congratulations on being selected for the role of UX Designer
                  at Searce
                </p>
              </Row>
            </Col>
            <Col
              className=" bg-[#FFFBF3] flex items-center justify-end"
              span={7}
            >
              <div className="flex justify-around w-full ">
                <div className=" flex flex-col items-center justify-center ">
                  <div className=" font-bold text-[#FFB414]">
                    {calculateDaysLeft()}
                  </div>
                  <div>Days to go</div>
                </div>
                <div className="w-[1px] my-[10px] h-[47px] bg-black"></div>
                <div className=" flex flex-col justify-center ">
                  <div>Your first day will be</div>
                  <div>{formatDate(user.date)}</div>
                </div>
              </div>
            </Col>
          </Row>
        </Typography>
      </Container>
      <Container>
        <Divider />
      </Container>
      <Container>
        <TaskList user={user} />
      </Container>
    </>
  );
}

export default NewHireDashboard;
