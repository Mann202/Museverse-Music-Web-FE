import React, { useEffect, useState } from 'react'
import Headers from '../Header/Header'
import { NavLink, useNavigate } from 'react-router-dom'
import { MdOutlineNavigateNext, MdCheckBox, MdCheckBoxOutlineBlank, MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md'
import { FaShoppingCart } from 'react-icons/fa'
import visa from '../../assets/visa.jpg'
import credit2 from '../../assets/credit2.png'
import group3707 from '../../assets/group-3707.svg'
import axios from 'axios'


const CheckOut = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [fname, setfname] = useState(user.first_name);
    const [lname, setlname] = useState(user.last_name);
    const [email, setemail] = useState(user.email_address);
    const [phone, setphone] = useState(user.contact_number);
    const [address, setaddress] = useState('Your address');
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
    let data = (JSON.parse(sessionStorage.getItem('cart')))
    useEffect(() => {
        if (data) {
            let sum = 0;
            data.forEach(item => {
                sum += item.total_money;
            });
            setTotal(sum);
        }
    }, [data]);
    const clickCont = () => {
        if (!cont && contNum === 0) {
            if (selectedCity == '')
                window.alert('Choose city');
            else if (selectedDistrict == '')
                window.alert('Choose district');
            else if (selectedWard == '')
                window.alert('Choose ward');
            else {
                setCont(true);
                setContNum(1);
            }

        } else {
            //thanh toan , luu vao databse
            if (contNum === 1) {
                if (selectedItem == null)
                    window.alert('Choose payment methods')
                else {

                    //Luu vao database
                    const fetchData = async () => {
                        try {
                            const user = JSON.parse(localStorage.getItem('user'));
                            let city = cities.filter((city) => city.Id == selectedCity);
                            let district = districts.filter((city) => city.Id == selectedDistrict);
                            let ward = wards.filter((city) => city.Id == selectedWard);

                            let FullAddress = address + ', ' + city[0].Name + ', ' + district[0].Name + ', ' + ward[0].Name;
                            let item = { cust_id: user.user_id, first_name: fname, last_name: lname, email_address: email, contact_number: phone, address: FullAddress, note: note, total_final: total, details: data };
                            const response = await fetch("http://localhost:8000/api/pay", {
                                method: 'POST',
                                body: JSON.stringify(item),
                                headers: {
                                    "Content-Type": 'application/json',
                                    "Accept": 'application/json'
                                }
                            });

                            if (response.ok) {
                                const result = await response.json();
                                if (result.hasOwnProperty('Error')) {
                                    console.log('Error', result['Error'])
                                } else {
                                    console.log('messs', result)
                                    window.alert('Order successfully');

                                    navigate('/albums');
                                }
                            } else {
                                console.error('Error:', response.statusText);
                            }
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    };

                    fetchData();
                }
            }
        }
    }
    const clickBack = () => {
        if (cont && contNum === 1) {
            setCont(false);
            setContNum(0);
        }
    }


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

    return (
        <div className='h-screen overflow-y-scroll'>
            <Headers />
            <div className='flex justify-between w-full h-[10%] mt-3 items-center '>
                <div className='text-[#EE5566] ml-5 flex items-center'>
                    <NavLink to={'/albums'} className='hover:underline'>Albums</NavLink>
                    <MdOutlineNavigateNext className='mt-1 text-white text-lg' />
                    <NavLink to={'/shoppingcart'} className='text-white hover:underline'>Shopping Cart</NavLink>
                    <MdOutlineNavigateNext className='mt-1 text-white text-lg' />
                    <div className='text-white'>Checkout</div>
                </div>
                <div className='mr-4 '>
                    <div className="flex gap-2 ml-4">
                        <button onClick={() => { navigate('/shoppingcart') }} className={`text-[#EE5566] bg-[#131313] hover:bg-[#262626] rounded-full h-10 w-10 flex justify-center items-center hover:text-lg active:bg-[#EE5566] active:text-white`}>
                            <FaShoppingCart className='text-xl font-semibold' />
                        </button>
                    </div>

                </div>
            </div>
            <div className='flex justify-between gap-5'>
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
                        <div className='text-white text-xl font-medium mb-3'>Contact Details</div>
                        <form action="">
                            <div className='flex flex-col gap-3 mb-5'>
                                <div className='flex gap-4'>
                                    <div className='flex flex-col w-1/2'>
                                        <div class="text-white text-[15px] font-medium">First Name</div>
                                        <input type="text" className='px-3 py-[9px] bg-white rounded border' value={user.first_name} />
                                    </div>
                                    <div className='flex flex-col w-1/2'>
                                        <div class="text-white text-[15px] font-medium">Last Name</div>
                                        <input type="text" className='px-3 py-[9px] bg-white rounded border' value={user.last_name} />
                                    </div>
                                </div>
                                <div className='flex flex-col w-full'>
                                    <div class="text-white text-[15px] font-medium">Email</div>
                                    <input type="text" className='w-full h-[42px] px-3 py-[9px] bg-white rounded border' value={user.email_address} />
                                </div>
                                <div className='flex flex-col w-full'>
                                    <div class="text-white text-[15px] font-medium">Phone Number</div>
                                    <input type="text" className='w-full h-[42px] px-3 py-[9px] bg-white rounded border' value={user.contact_number} />
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
                        </form>
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
                                        <div class=" text-white text-base font-bold">Album 1</div>
                                        <div class=" text-white text-xs font-medium mb-4">Artist Name</div>
                                        <div class=" text-white text-xs font-medium">Quantity: {item.num}</div>
                                        <div class=" text-white text-base font-bold">{item.price} VND</div>
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
                        <div className="w-[150px] h-9 flex bg-[#EE5566] rounded-[50px] justify-center items-center cursor-pointer select-none hover:bg-[#f17482]"
                            onClick={clickCont}>
                            <div className="text-white text-sm font-semibold">Continue</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckOut