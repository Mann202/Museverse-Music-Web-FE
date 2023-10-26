import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const usePasswordToggle = () => {
    const [visible, setVisible] = useState(false);

    
    const change = () => {
        setVisible(!visible);
    };

    const InputType = visible ? "text" : "password";
    const Icon = visible ? FaEyeSlash : FaEye;

    return [InputType, Icon, change];
};

export default usePasswordToggle;