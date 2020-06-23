import React from "react";
import { Modal } from "antd";

import { deleteEvent } from "../api/Schedule";

const CustomModal = ({
  openModal,
  setLoading,
  eventId,
  handleDelete,
  setSnackOpen,
  setOpenModal,
  loading,
  eventName,
}) => {
  return (
    <Modal
      title="Delete confirmation"
      visible={openModal}
      okText="Delete"
      onOk={() => {
        setLoading(true);
        deleteEvent(eventId).then((response) => {
          setLoading(false);
          handleDelete(eventId);
          setSnackOpen(true);
          setOpenModal(false);
        });
      }}
      onCancel={() => {
        setOpenModal(false);
      }}
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
    >
      <p>
        Are you sure you want to delete the event: <strong>{eventName}</strong>
      </p>
    </Modal>
  );
};

export default CustomModal;
