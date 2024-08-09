import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Row,
  Col,
  Select,
  message,
} from "antd";
import moment from "moment";

function AddNewHire({ addHire, setAddHire, editData }) {
  const [form] = Form.useForm();
  const { _id, name, email, contact, date, tasks: editTasks = [] } = editData;
  const [tasks, setTasks] = useState([{ id: 1 }]);

  useEffect(() => {
    if (editTasks && editTasks.length > 0) {
      setTasks(editTasks.map((_, index) => ({ id: index + 1 })));
    }
  }, [editTasks]);

  const onFinish = async (e) => {
    try {
      const allUserTasks = tasks.map((task, index) => ({
        description: e[`description_${task.id}`],
        type: e[`taskType_${task.id}`],
        title: e[`taskTitle_${task.id}`],
      }));

      const { contactNo, name, email, dateOfJoining } = e;
      const token = localStorage.getItem("token");

      if (_id) {
        await axios.put(
          `http://localhost:5000/api/users/${_id}`,
          {
            name,
            contact: contactNo,
            email,
            date: dateOfJoining,
            tasks: allUserTasks,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Hire and tasks updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/users/register",
          {
            name,
            contact: contactNo,
            email,
            role: "hire",
            password: "123",
            date: dateOfJoining,
            tasks: allUserTasks,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("New hire and tasks added successfully");
      }

      setAddHire(false);
      form.resetFields();
      setTasks([{ id: 1 }]);
    } catch (err) {
      console.error(err);
      message.error("There was an error processing your request.");
    }
  };

  const handleAddTask = () => {
    setTasks([...tasks, { id: tasks.length + 1 }]);
  };

  return (
    <Modal
      footer={null}
      open={addHire}
      onOk={() => setAddHire(false)}
      onCancel={() => setAddHire(false)}
    >
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              initialValue={name}
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please input the name" }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              initialValue={email}
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input the email" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              initialValue={contact}
              name="contactNo"
              label="Contact No"
              rules={[
                { required: true, message: "Please input the contact number" },
              ]}
            >
              <Input placeholder="Contact No" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              initialValue={moment(date)}
              name="dateOfJoining"
              label="Date of Joining"
              rules={[
                {
                  required: true,
                  message: "Please select the date of joining",
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
        {tasks.map((task, index) => (
          <div key={index} className=" bg-[#F9F9F9] mb-3 px-4 py-3">
            <Row>
              <h3>Task {task.id}</h3>
            </Row>
            <Row gutter={16} key={task.id}>
              <Col span={12}>
                <Form.Item
                  name={`taskTitle_${task.id}`}
                  rules={[
                    {
                      required: true,
                      message: `Please input the title for Task ${task.id}`,
                    },
                  ]}
                  initialValue={editTasks[index]?.title}
                >
                  <Input placeholder={`Title`} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={`taskType_${task.id}`}
                  initialValue={editTasks[index]?.type}
                  rules={[
                    {
                      required: true,
                      message: `Please select the type for Task ${task.id}`,
                    },
                  ]}
                >
                  <Select placeholder={`Task Type`}>
                    <Select.Option value="File Upload">
                      File Upload
                    </Select.Option>
                    <Select.Option value="Text Input">Text Input</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  initialValue={editTasks[index]?.description}
                  name={`description_${task.id}`}
                >
                  <Input placeholder="Type here" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        ))}
        <Button
          className="rounded-3xl  mt-3 "
          type="dashed"
          onClick={handleAddTask}
        >
          Add Task
        </Button>
        <Row justify="end" style={{ marginTop: "16px" }}>
          <Button htmlType="submit" className="rounded-3xl  bg-[#FFB414] ">
            Submit
          </Button>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddNewHire;
