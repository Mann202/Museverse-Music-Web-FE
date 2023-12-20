import { useNavigate } from "react-router-dom";
import notfound from "./notfound.jpg";

export default function NotFound() {
    const navigate = useNavigate()

  const backgroundStyle = {
    backgroundImage: `url(${notfound})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    height: "100vh", // Sử dụng 100vh để thiết lập chiều cao bằng 100% chiều cao của màn hình
  };

  function handleChange() {
    const path="/"
    navigate(path)
  }

  return (
    <div onClick={handleChange} style={backgroundStyle}>
    </div>
  );
}
