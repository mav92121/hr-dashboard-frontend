import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import {
  Button,
  Table,
  Row,
  Col,
  Card,
  Typography,
  Space,
  Progress,
} from "antd";
import axios from "axios";
import { CopyOutlined, EditOutlined } from "@ant-design/icons";
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  RightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import AddNewHire from "../components/AddNewHire";
import moment from "moment";
import TaskModal from "../components/TaskModal";

const { Text } = Typography;

function HRDashboard({ user }) {
  const [data, setData] = useState([]);
  const [addHire, setAddHire] = useState(false);
  const [editData, setEditData] = useState();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [selectedTask, setSelectedTask] = useState(undefined);

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([record._id]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/users").then((response) => {
      console.log("res -> ", response);
      setData(response.data);
    });
  }, [addHire]);
  const columns = [
    {
      title: "Employee Id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date of Joining",
      dataIndex: "date",
      key: "date",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Task Assigned",
      dataIndex: "taskCount",
      key: "taskCount",
      render: (text, record) => record.tasks.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 200,
      render: (text, record) => {
        const completedTasks = record.tasks.filter(
          (task) => task.status === "completed"
        ).length;
        const totalTasks = record.tasks.length;
        const progressPercentage = (completedTasks / totalTasks) * 100;
        return (
          <div>
            <div>{`${completedTasks}/${totalTasks}`}</div>
            <Progress
              percent={progressPercentage}
              strokeColor="#52c41a"
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="flex gap-2">
          <Button
            className="rounded-3xl cursor-pointer"
            size="small"
            onClick={() => {
              setAddHire(true);
              setEditData(record);
            }}
            style={{ borderColor: "#FFB414" }}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Button
            className="rounded-3xl cursor-pointer"
            style={{ borderColor: "#FFB414" }}
            size="small"
            onClick={() => console.log("Delete", record)}
          >
            <CopyOutlined /> Invite link
          </Button>
        </div>
      ),
    },
  ];
  const handleClick = (task) => {
    if (task.status == "completed") {
      setSelectedTask(task);
    }
  };
  const expandedRowRender = (record) => {
    return (
      <>
        <Row gutter={[16, 16]}>
          {record.tasks.map((task, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={8}>
              <Card
                bordered
                style={{ borderRadius: 8, position: "relative" }}
                bodyStyle={{ padding: 16 }}
                className="task-card min-h-[70px] cursor-pointer"
                onClick={() => handleClick(task)}
              >
                <Space direction="vertical" size="small">
                  <Text strong style={{ paddingRight: "32px" }}>
                    {task.title}
                  </Text>
                  <div className="flex justify-between w-full">
                    <div className="flex-1">
                      <span className="block truncate">{task.type}</span>
                    </div>
                    <div className="w-[1px] h-[20px] bg-black mx-2"></div>
                    <div className="flex flex-col justify-center flex-1">
                      {task.status === "pending" && (
                        <div className="text-[#F84912]">Pending</div>
                      )}
                      {task.status === "completed" && <div>Completed</div>}
                    </div>
                  </div>
                </Space>
                <div style={{ position: "absolute", top: 16, right: 16 }}>
                  {task.status === "completed" ? (
                    <CheckCircleOutlined
                      style={{ color: "#52c41a", fontSize: 24 }}
                    />
                  ) : (
                    <InfoCircleOutlined
                      style={{ color: "#fa8c16", fontSize: 24 }}
                    />
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        {selectedTask?._id !== undefined && (
          <TaskModal
            user={user}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
          />
        )}
      </>
    );
    return;
  };

  return (
    <>
      <Container>
        <div className="flex bg-slate-5 justify-between my-4">
          <p className=" font-bold cursor-pointer ">New Hire</p>
          <Button
            onClick={() => {
              setEditData({});
              setAddHire(true);
            }}
            className=" bg-[#FFB414] text-sm p-3 rounded-3xl "
          >
            + Add new Hire
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          expandable={{
            expandedRowRender,
            expandedRowKeys: expandedRowKeys,
            onExpand: handleExpand,
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <DownOutlined onClick={(e) => onExpand(record, e)} />
              ) : (
                <RightOutlined onClick={(e) => onExpand(record, e)} />
              ),
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
          rowKey={(record) => record._id}
        />
      </Container>
      {addHire && (
        <AddNewHire
          editData={editData}
          setAddHire={setAddHire}
          addHire={addHire}
        />
      )}
    </>
  );
}

export default HRDashboard;
