import React, { useEffect, useState } from 'react'
import Headers from '../../Header/Header'
import { NavLink, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { MdCheckBox, MdCheckBoxOutlineBlank, MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';
import visa from '../../../assets/visa.jpg'
import credit2 from '../../../assets/credit2.png'
import group3707 from '../../../assets/group-3707.svg'
import { IoMdSearch } from 'react-icons/io';
import Swal from 'sweetalert2';
import Loading from '../../Loading/Loading';
import axiosInstance from '../../../API/axios';

const OrderCheckout = () => {
    const [user, setUser] = useState();
    const [searchemail, setsearchemail] = useState();
    const [address, setaddress] = useState('');
    const [note, setnote] = useState('');
    const [total, setTotal] = useState(0);
    const [cont, setCont] = useState(false);
    const [contNum, setContNum] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState('');
    const [addNewCus, setAddNewCus] = useState(false);
    const [details, setDetails] = useState([]);
    const [load, setLoad] = useState(true);

    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        phone: '',
    })
    const [errors, setErrors] = useState({})
    const handleItemToggle = (item) => {
        setSelectedItem(item);
    };


    const navigate = useNavigate();
    const [check, setCheck] = useState(false);

    const handleCheck = () => {
        if (check)
            setCheck(false)
        else
            setCheck(true)
    }
    // const [data, setData] = useState([]);
    let data = (JSON.parse(sessionStorage.getItem('order')))
    useEffect(() => {
        if (data) {
            let sum = 0;
            data.forEach(item => {
                sum += item.total_money;
            });
            setTotal(sum);
        }
    }, [data]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json'
                );
                const data = response.data;
                setCities(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setSelectedCity(selectedCity);
        setSelectedDistrict('');
        setSelectedWard('');

        // Filter districts based on selected city
        const filteredDistricts = cities.find((city) => city.Id === selectedCity)?.Districts || [];
        setDistricts(filteredDistricts);
    };

    const handleDistrictChange = (e) => {
        const selectedDistrict = e.target.value;
        setSelectedDistrict(selectedDistrict);
        setSelectedWard('');

        // Filter wards based on selected district
        const filteredWards =
            districts.find((district) => district.Id === selectedDistrict)?.Wards || [];
        setWards(filteredWards);
    };

    const handleWardChange = (e) => {
        const selectedWard = e.target.value;
        setSelectedWard(selectedWard);
    };

    const handleSearchEmail = () => {
        const searchEmail = async () => {
            try {
                setLoad(false);
                let item = { email: searchemail };
                const response = await axiosInstance("/api/searchCusEmail", {
                    method: 'POST',
                    data: item,
                });

                setAddNewCus(true);
                const result = response.data
                setUser(result);
                // console.log('ủe', user)
                setLoad(true);
                setFormData({
                    fname: result.first_name != null ? result.first_name : '',
                    lname: result.last_name != null ? result.last_name : '',
                    phone: result.contact_number != null ? result.contact_number : '',
                    email: result.email_address != null ? result.email_address : ''
                });
            } catch (error) {
                console.warn('Error:', error);
                setLoad(true);
            }
        };

        searchEmail();
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, [name]: value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = []

        if (!formData.fname.trim()) {
            validationErrors.fname = "First name is required"
        }
        if (!formData.lname.trim()) {
            validationErrors.lname = "Last name is required"
        }
        if (!formData.email.trim()) {
            validationErrors.email = "Email is required"
        }
        if (!formData.phone.trim()) {
            validationErrors.phone = "Phone number is required"
        }
        if (selectedCity == '')
            validationErrors.city = 'Choose city';
        else if (selectedDistrict == '')
            validationErrors.district = 'Choose district';
        else if (selectedWard == '')
            validationErrors.ward = 'Choose ward';
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length === 0) {
            setCont(true);
            setContNum(1);
            const createOrder = async () => {
                try {
                    setLoad(false);
                    let item = { cust_id: user.user_id, details: data };
                    const response = await axiosInstance("/api/createOrder", {
                        method: 'POST',
                        data: item
                    });

                    const result = response.data;
                    setDetails(result);
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    setLoad(true);
                }
            };
            createOrder();
        }
        if (addNewCus == false) window.alert('Enter customer email!')
        if (contNum === 1) {
            if (selectedItem == null)
                window.alert('Choose payment methods')
            else {
                const fetchData = async () => {
                    try {
                        setLoad(false);
                        const updatedData = data.map((item, index) => {
                            console.log('detail_id', details[index].detail_id)
                            return { ...item, detail_id: details[index].detail_id };
                        });
                        data = updatedData;
                        let city = cities.filter((city) => city.Id == selectedCity);
                        let district = districts.filter((city) => city.Id == selectedDistrict);
                        let ward = wards.filter((city) => city.Id == selectedWard);
                        let FullAddress = (address ? `${address}, ` : '') + ward[0].Name + ', ' + district[0].Name + ', ' + city[0].Name;
                        let item = { cust_id: user.user_id, first_name: formData.fname, last_name: formData.lname, email_address: formData.email, contact_number: formData.phone, address: FullAddress, note: note, total_final: total, details: data };
                        const response = await axiosInstance("/api/pay", {
                            method: 'POST',
                            data: item
                        });

                        const result = response.data
                        setLoad(true);
                        if (result.hasOwnProperty('Error')) {
                            console.log('Error', result['Error'])
                        } else {
                            console.log('messs', result)
                            window.alert('Create order successfully!');
                            navigate('/orders');
                        }
                    } catch (error) {
                        if (error instanceof AxiosError) {
                            console.error('Error:', error.response.statusText);
                            window.alert('Pay failed!');
                            // window.alert('Error:', error);
                            setLoad(true);
                        }
                    }
                };
                fetchData();
            }
        }

    }
    const clickBack = () => {
        if (cont && contNum === 1) {
            setCont(false);
            setContNum(0);
        }
    }

    if (!load) return <Loading />;

    return (
        <div className='relative flex flex-col h-screen'>
            <Headers />
            <div className='flex flex-col overflow-y-scroll'>
                {!addNewCus ?
                    <div className='mx-5 w-2/5'>
                        <div className='text-[#EE5566] mt-3 font-bold text-lg'>Enter customer email</div>
                        <div className='flex flex-col w-full'>
                            <div class="text-white text-[15px] font-medium">Email</div>
                            <div className='flex gap-3'>
                                <input type="text" className='w-[90%] h-[42px] px-3 py-[9px] bg-white rounded border' value={searchemail} onChange={(e) => { setsearchemail(e.target.value) }} />
                                <button className='w-[10%] h-[42px] flex justify-center items-center text-2xl bg-white rounded border' onClick={handleSearchEmail}>
                                    <IoMdSearch />
                                </button>
                            </div>
                        </div>
                    </div>
                    : ''}
                <form action="" onSubmit={handleSubmit}>
                    <div className='flex justify-between gap-5 py-5'>
                        {cont ?
                            <div className='flex flex-col ml-5 w-2/5 gap-4'>
                                <div className='text-white text-xl font-medium mb-3'>Payment Methods</div>
                                <div className='flex text-white justify-between w-[70%]' >
                                    <div className='flex gap-2'>
                                        <div
                                            onClick={() => handleItemToggle('Credit')}
                                            onChange={() => handleItemToggle('Credit')}
                                            className='mt-1 text-[#EE5566]'
                                        >
                                            {selectedItem === 'Credit' ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
                                        </div>
                                        <div className='flex flex-col'>
                                            <div class=" text-white text-[15px] font-bold">Credit/Debit Cards</div>
                                            <div class=" text-white text-[13px] font-normal">Pay with your Credit / Debit Card</div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <img src={visa} alt="" />
                                        <img src={credit2} alt="" />
                                    </div>
                                </div>
                                <div className='flex text-white justify-between w-[70%]' >
                                    <div className='flex gap-2'>
                                        <div
                                            onClick={() => handleItemToggle('Direct')}
                                            onChange={() => handleItemToggle('Direct')}
                                            className='mt-1 text-[#EE5566]'
                                        >
                                            {selectedItem === 'Direct' ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
                                        </div>
                                        <div className='flex flex-col'>
                                            <div class=" text-white text-[15px] font-bold">Direct Bank Transfer</div>
                                            <div class=" text-white text-[13px] font-normal">Make payment directly through bank account.</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex text-white justify-between w-[70%]' >
                                    <div className='flex gap-2'>
                                        <div
                                            onClick={() => handleItemToggle('Other')}
                                            onChange={() => handleItemToggle('Other')}
                                            className='mt-1 text-[#EE5566]'
                                        >
                                            {selectedItem === 'Other' ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
                                        </div>
                                        <div className='flex flex-col'>
                                            <div class=" text-white text-[15px] font-bold">Other Payment Methods</div>
                                            <div class=" text-white text-[13px] font-normal">Make payment through Gpay, Paypal, Paytm etc</div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <img src={group3707} alt="" />
                                    </div>
                                </div>
                            </div>
                            :
                            <div className='flex flex-col ml-5 w-2/5'>
                                {addNewCus ?
                                    <div>
                                        <div className='text-white text-xl font-medium mb-3'>Contact Details</div>
                                        <div className='flex flex-col gap-3 mb-5'>
                                            <div className='flex gap-4'>
                                                <div className='flex flex-col w-1/2'>
                                                    <div class="text-white text-[15px] font-medium">First Name</div>
                                                    <input type="text" className='px-3 py-[9px] bg-white rounded border' value={formData.fname} onChange={handleChange} name='fname' />
                                                    <div className='text-red-600'>
                                                        {errors.fname && <span>{errors.fname}</span>}
                                                    </div>
                                                </div>
                                                <div className='flex flex-col w-1/2'>
                                                    <div class="text-white text-[15px] font-medium">Last Name</div>
                                                    <input type="text" className='px-3 py-[9px] bg-white rounded border' value={formData.lname} onChange={handleChange} name='lname' />
                                                    <div className='text-red-600'>
                                                        {errors.lname && <span>{errors.lname}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex flex-col w-full'>
                                                <div class="text-white text-[15px] font-medium">Email</div>
                                                <input type="text" className='w-full h-[42px] px-3 py-[9px] bg-white rounded border' value={formData.email} onChange={handleChange} name='email' />
                                                <div className='text-red-600'>
                                                    {errors.email && <span>{errors.email}</span>}
                                                </div>
                                            </div>
                                            <div className='flex flex-col w-full'>
                                                <div class="text-white text-[15px] font-medium">Phone Number</div>
                                                <input type="text" className='w-full h-[42px] px-3 py-[9px] bg-white rounded border' value={formData.phone} onChange={handleChange} name='phone' />
                                                <div className='text-red-600'>
                                                    {errors.phone && <span>{errors.phone}</span>}
                                                </div>
                                            </div>
                                            <hr className='border-[#EE5566] w-full my-1' />
                                            <div className='text-white text-xl font-medium'>Shipping Details</div>
                                            <div className='flex flex-col w-full'>
                                                <div class="text-white text-[15px] font-medium">Address</div>
                                                <input type="text" className='w-full h-[42px] px-3 py-[9px] bg-white rounded border' placeholder='Your address' onChange={(e) => { setaddress(e.target.value) }} />
                                            </div>
                                            <div className='flex gap-4'>
                                                <div className='flex flex-col w-1/2'>
                                                    <div class="text-white text-[15px] font-medium">Province/City</div>
                                                    <select
                                                        className="px-3 py-[9px] bg-white rounded border"
                                                        value={selectedCity}
                                                        onChange={handleCityChange}
                                                    >
                                                        <option value="" disabled>
                                                            Choose Province/City
                                                        </option>
                                                        {cities.map((city) => (
                                                            <option key={city.Id} value={city.Id}>
                                                                {city.Name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='text-red-600'>
                                                        {errors.city && <span>{errors.city}</span>}
                                                    </div>
                                                </div>
                                                <div className='flex flex-col w-1/2'>
                                                    <div class="text-white text-[15px] font-medium">District</div>
                                                    <select
                                                        className="px-3 py-[9px] bg-white rounded border"
                                                        value={selectedDistrict}
                                                        onChange={handleDistrictChange}
                                                        disabled={!selectedCity}
                                                    >
                                                        <option value="" disabled>
                                                            Choose District
                                                        </option>
                                                        {districts.map((district) => (
                                                            <option key={district.Id} value={district.Id}>
                                                                {district.Name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='text-red-600'>
                                                        {errors.district && <span>{errors.district}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex gap-4'>
                                                <div className='flex flex-col w-1/2'>
                                                    <div class="text-white text-[15px] font-medium">Ward/Commune</div>
                                                    <select
                                                        className="px-3 py-[9px] bg-white rounded border"
                                                        value={selectedWard}
                                                        onChange={handleWardChange}
                                                        disabled={!selectedDistrict}
                                                    >
                                                        <option value="" disabled>
                                                            Choose Ward/Commune
                                                        </option>
                                                        {wards.map((ward) => (
                                                            <option key={ward.Id} value={ward.Id}>
                                                                {ward.Name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='text-red-600'>
                                                        {errors.ward && <span>{errors.ward}</span>}
                                                    </div>
                                                </div>
                                                <div className='flex flex-col w-1/2'>
                                                    <div class="text-white text-[15px] font-medium">Note</div>
                                                    <input type="text" className='px-3 py-[9px] bg-white rounded border' placeholder='' onChange={(e) => { setaddress(e.target.value) }} />
                                                </div>
                                            </div>
                                            <div>
                                            </div>
                                            <div className='flex gap-2 text-white text-sm font-normal items-center' >
                                                <div className='mt-1 text-[#EE5566]' onClick={handleCheck}>{check ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}</div>
                                                <div >My shipping and Billing address are the same</div>
                                            </div>
                                        </div>

                                    </div>
                                    : ''}

                            </div>
                        }
                        <div className='flex flex-col mr-5 w-2/5'>
                            <div className='text-white text-xl font-medium w-full'>Order Summary</div>
                            {data.map((item, index) => {
                                return (
                                    <div className='flex flex-col'>
                                        <div className='flex gap-3'>
                                            <img src={item.url_poster} alt="" className='w-[100px] h-[100px]' />
                                            <div className='flex flex-col w-[200px]'>
                                                <div class=" text-white text-base font-bold">{(item.album_name.length < 28) ? item.album_name : item.album_name.substring(0, 28 - 3) + '...'}</div>
                                                <div class=" text-white text-xs font-semibold">{(item.variant_name) ? item.variant_name : 'Normal'}</div>

                                                <div class=" text-white text-xs font-medium">Quantity: {item.num}</div>
                                                <div class=" text-white text-base font-bold">{item.variant_price} VND</div>
                                            </div>
                                            <div class=" text-[#EE5566] text-base font-semibold">{item.total_money} VND</div>
                                        </div>
                                        <hr className='border-[#EE5566] w-full my-2' />
                                    </div>
                                )
                            })
                            }
                            <div class=" text-rose-500 text-[15px] font-medium">Gift Card / Discount code</div>
                            <div className='flex gap-4 mb-3'>
                                <input type="text" className='w-[314.33px] h-9 px-3 py-[9px] bg-white rounded border' />
                                <div class="w-[123.40px] h-9 rounded border border-rose-500 text-rose-500 flex justify-center items-center hover:bg-[#262626] cursor-pointer select-none">Apply</div>
                            </div>
                            <div className="flex justify-between my-3">
                                <div class="text-white text-[15px] font-medium">Subtotal</div>
                                <div class=" text-rose-500 text-base font-bold ">
                                    {total} VND
                                </div>
                            </div>
                            <div className="flex justify-between my-3">
                                <div class="text-white text-[15px] font-medium">Shipping Fee</div>
                                <div class=" text-green-400 text-[15px] font-normal ">FREE</div>
                            </div>
                            <div className="flex justify-between my-3">
                                <div class="text-white text-[15px] font-medium">Total due</div>
                                <div class=" text-rose-500 text-base font-bold ">{total} VND</div>
                            </div>
                            <div className='w-full flex justify-end mt-3 gap-3'>
                                <div className="w-[150px] h-9 flex rounded-[50px] justify-center items-center cursor-pointer select-none hover:bg-[#262626] border-[#EE5566] border-2 text-[#EE5566]"
                                    onClick={clickBack}>
                                    <div className="text-sm font-semibold">Back</div>
                                </div>
                                <button className="w-[150px] h-9 flex bg-[#EE5566] rounded-[50px] justify-center items-center cursor-pointer select-none hover:bg-[#f17482]"
                                    type='submit'>
                                    <div className="text-white text-sm font-semibold">Continue</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>


        </div>
    )
}

export default OrderCheckout