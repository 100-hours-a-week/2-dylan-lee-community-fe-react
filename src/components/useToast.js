import { toast } from "material-react-toastify";

const useToast = () => {
  const showToast = (message, type = "default") => {
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

  return { showToast };
};

export default useToast;
