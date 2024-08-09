import { Row, Col, Card, Typography, Space } from "antd";
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import axios from "axios";
import TaskModal from "./TaskModal";

const { Text } = Typography;

const TaskList = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(undefined);
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/users/get_tasks/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(res.data);
    };
    fetchTasks();
  }, [selectedTask]);
  const handleCardClick = (task) => {
    setSelectedTask(task);
  };
  return (
    <>
      <Typography.Title level={4}>Your tasks</Typography.Title>
      <Row gutter={[16, 16]}>
        {tasks?.map((task, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={8}>
            <Card
              onClick={() => handleCardClick(task)}
              bordered
              style={{
                borderRadius: 8,
                position: "relative",
                width: "100%",
              }}
              bodyStyle={{ padding: 16 }}
              className="task-card min-h-[120px] cursor-pointer"
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
};

export default TaskList;
