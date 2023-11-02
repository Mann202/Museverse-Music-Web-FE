import { useState, useEffect } from "react";
import { useNavigate  } from 'react-router-dom'

import { AiOutlineSearch } from "react-icons/ai";


export default function SearchBar() {
    const [focus, setFocus] = useState(false)
    const [inputValue, setInputValue] = useState('')

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/search`; 
        navigate(path);
    }

    useEffect(() => {
      let timer;
      if (inputValue) {
        timer = setTimeout(() => {
          let path = `/search/${inputValue}`;
          navigate(path);
        }, 500); // Chờ 1 giây sau khi người dùng ngưng nhập liệu
      }
      return () => {
        clearTimeout(timer); // Xóa timer khi giá trị inputValue thay đổi
      };
    }, [inputValue, navigate]);
  
    function handleChange(event) {
      const value = event.target.value;
      setInputValue(value);
    }
    
      return (
        <>
          <div
            className={`bg-black bg-opacity-90 w-[389px] h-[40px] flex flex-row rounded-lg ${
              focus ? "border-[#EE5566] border-2" : ""
            }`}
          >
            <div className="flex justify-center items-center">
              <AiOutlineSearch
                className={`mx-2 text-xl ${
                  focus ? "text-[#EE5566]" : "text-[#939393]"
                }`}
              />
            </div>
            <input
              placeholder="Search"
              onChange={handleChange}
              value={inputValue}
              onClick={routeChange}
              onFocus={() => {
                setFocus(true);
              }}
              onBlur={() => {
                setFocus(false);
              }}
              className="w-full text-[#FCFCFC] rounded-lg bg-black/5 bg-opacity-10 placeholder-[#939393] focus:outline-none"
            />
          </div>
        </>
      );
}