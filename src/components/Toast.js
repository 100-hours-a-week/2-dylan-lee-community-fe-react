import React from "react";
import { toast, ToastContainer } from "material-react-toastify";

const showToast_ = (message, type = "default") => {
  const options = {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warn":
      toast.warn(message, options);
      break;
    default:
      toast.dark(message, options); // Default toast
  }
};

const ToastProvider = () => {
  <>
    <ToastContainer position="bottom-center" autoClose={3000} />
  </>;
};

export { showToast_, ToastProvider };
