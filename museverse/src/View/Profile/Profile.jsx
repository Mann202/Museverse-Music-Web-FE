import React, { useState } from "react";
import Headers from "../Header/Header";
import axiosInstance from "../../API/axios";

const gender = [
  { gender: "Nam", value: "male" },
  { gender: "Nữ", value: "female" },
  { gender: "Other", value: "orther" },
];

const country = [
  { country: "Việt Nam", code: "vn" },
  // { country: "Thái Lan", code: "th" },
  // { country: "Lào", code: "la" },
];
const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const initialData = {
  email: "",
  gender: "",
  day: "",
  month: "",
  year: "",
  country: "",
  first_name: '',
  last_name: '',
  contact_number: ''
};

// Func get data
function ProfileEditor(props) {
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    console.log('error parse theme setting data', e);
  }

  initialData.email = user?.email_address || '';
  initialData.first_name = user?.first_name || '';
  initialData.last_name = user?.last_name || '';
  initialData.contact_number = user?.contact_number || '';
  if (user?.date_of_birth) {
    const dateParts = user?.date_of_birth.split("-");

    // Tạo đối tượng Date từ các phần tử cắt được
    const date = new Date(dateParts[0], parseInt(dateParts[1]) - 1, dateParts[2]);

    // Lấy các phần riêng biệt
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng trong JS bắt đầu từ 0, nên cần cộng 1
    const year = date.getFullYear();
    initialData.day = day;
    initialData.month = month;
    initialData.year = year;
  }

  const [formData, setFormData] = useState(initialData);

  const [validates, setValidates] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidates(initialData);
  };

  const validateEmail = (input) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dateOfBirth = handleParseDate();

    try {
      const response = await axiosInstance(`/api/user/${user.user_id}`, {
        method: 'POST',
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          contact_number: formData.contact_number,
          date_of_birth: dateOfBirth,
        }
      })

      const result = response.data;

      if (result) {
        console.log('user', user)
        user.first_name = formData.first_name;
        user.last_name = formData.last_name;
        user.contact_number = formData.contact_number;
        user.date_of_birth = dateOfBirth;

        localStorage.setItem('user', JSON.stringify(user));
        alert(result)
      }
    } catch (error) {
      alert("Không thành công");

    }
  };

  const handleParseDate = () => {
    if (!formData.day || !formData.month || !formData.year) {
      return;
    }

    return formData.year + '-' + formData.month + '-' + formData.day;
  }

  const handleReset = () => {
    setFormData(initialData);
    setValidates(initialData);
  };


  return (
    <div className="h-screen overflow-y-scroll pb-48">
      <Headers />
      <div className="container mx-auto p-4 text-white pt-16">
        <div className="md:w-7/12 w-12/12 mx-auto">
          <div className="shadow-md rounded">
            <h1 className="mb-10 text-5xl font-semibold">Chỉnh sửa hồ sơ</h1>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="last_name">
                First name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
                type="text"
                name="last_name"
                id="email"
                placeholder="Last name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="first_name">
                Last name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
                type="text"
                name="first_name"
                id="email"
                placeholder="demo"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>

            {/* Số đt */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="first_name">
                Contact number
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
                type="text"
                name="contact_number"
                // id="email"
                placeholder="PhoneNum"
                value={formData.contact_number}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
                type="text"
                name="email"
                id="email"
                placeholder="email@gmail.com"
                disabled={true}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="gender"
              >
                Giới tính
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                {gender.map((item) => (
                  <option
                    className="bg-gray-300 text-gray-900"
                    key={"gender" + item.value}
                    value={item.value}
                  >
                    {item.gender}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="dob">
                Ngày sinh
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
                  type="text"
                  name="day"
                  placeholder="Ngày"
                  value={formData.day}
                  onChange={handleChange}
                />
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
                  name="month"
                  id="month"
                  value={formData.month}
                  onChange={handleChange}
                >
                  {month.map((item) => (
                    <option
                      className="bg-gray-300 text-gray-900"
                      key={"month" + item}
                      value={item}
                    >
                      Tháng {item}
                    </option>
                  ))}
                </select>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
                  type="text"
                  name="year"
                  placeholder="Năm"
                  value={formData.year}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="country"
              >
                Quốc gia khu vực
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
                name="country"
                id="country"
                value={formData.country}
                onChange={handleChange}
              >
                {country.map((item) => (
                  <option
                    className="bg-gray-300 text-gray-900"
                    key={"country" + item.country}
                    value={item.country}
                  >
                    {item.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="share-info"
                  value="1"
                  className="form-tick appearance-none h-4 w-4 border border-gray-300 rounded-md checked:bg-[#EE5566] checked:border-transparent focus:outline-none "
                />
                <small className="font-medium">
                  Accept our tern and condition
                </small>
              </label>
            </div>
          </div>
          <hr className="my-4 border-gray-800" />
          <div className="flex items-center justify-end">
            <button
              className="hover:bg-gray-800 text-white font-semibold py-2 px-4 focus:outline-none focus:shadow-outline rounded-full mr-3"
              onClick={handleReset}
              type="button"
            >
              Hủy
            </button>
            <button
              className="bg-[#EE5566] hover:bg-[#876166] text-white font-semibold py-2 px-4 focus:outline-none focus:shadow-outline rounded-full"
              onClick={handleSubmit}
              type="button"
            >
              Lưu hồ sơ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditor;