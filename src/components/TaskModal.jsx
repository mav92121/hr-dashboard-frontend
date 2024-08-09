import React, { useState } from "react";
import { Modal, Row, Button, Divider, Input, Form, Col, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const TaskModal = ({ selectedTask: task, setSelectedTask, user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const onFinish = async (values) => {
    try {
      const payload = {
        userId: user._id,
        taskId: task._id,
        response: values.text || values.file,
      };

      console.log("Payload -> ", payload);
      const response = await axios.post(
        "http://localhost:5000/api/users/update_task",
        payload
      );
      console.log("Response from server -> ", response.data);
      setSelectedTask(undefined);
    } catch (error) {
      console.error("Error updating task -> ", error);
    }
    setSelectedTask(undefined);
  };

  return (
    <div>
      <Modal
        title={task?.title}
        open={task?._id !== undefined}
        footer={null}
        onCancel={() => setSelectedTask(undefined)}
      >
        <Divider />
        <Row>
          <p>{task.description}</p>
        </Row>
        <Form form={form} onFinish={onFinish}>
          <Row className="mt-2">
            <Col style={{ width: "100%" }} span={22}>
              {task.type === "File Upload" && (
                <Form.Item initialValue={task?.response} name="file">
                  <Upload
                    style={{ width: "100%" }}
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
              )}
              {task.type === "Text Input" && (
                <Form.Item initialValue={task.response} name="text">
                  <Input.TextArea rows={5} />
                </Form.Item>
              )}
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: "16px" }}>
            <Button htmlType="submit" className="rounded-3xl  bg-[#FFB414] ">
              Submit
            </Button>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskModal;
