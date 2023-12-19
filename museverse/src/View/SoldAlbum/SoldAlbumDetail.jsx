import React, { useEffect, useState } from 'react'
import Headers from '../Header/Header'
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import Loading from '../Loading/Loading';
import { MdOutlineNavigateNext } from "react-icons/md";
import axios from 'axios';
import { Spotify } from '../../API/Credentials';
import axiosInstance from '../../API/axios';

const Albums = () => {
    const navigate = useNavigate();
    const { album_phys_id } = useParams();
    const [data, setData] = useState(null);
    const [load, setLoad] = useState(false);
    const [load2, setLoad2] = useState(false);
    const [load3, setLoad3] = useState(false);
    const [hasVer, sethasVer] = useState([]);
    const [value, setValue] = useState(1);
    const [price, setPrice] = useState(0);
    const [activeButton, setActiveButton] = useState('');
    const [clickCount, setClickCount] = useState(0);
    const [quan, setQuan] = useState(0);

    const handleClick = (buttonName) => {
        if (activeButton === buttonName && clickCount === 1) {
            setActiveButton('');
            setClickCount(0);
        } else {
            setActiveButton(buttonName);
            {
                (hasVer.length != 0) ?
                    (hasVer.map(() => {
                        const ver = hasVer.find(a => a.variant_name === buttonName);
                        setPrice(ver.variant_price)
                        setQuan(ver.stock_quantity)
                    }))
                    : setPrice(data.max_price)
            }
            setClickCount(1);
        }
    };
    const handleAddtoCart = () => {
        if (activeButton === '' && clickCount === 0 && hasVer.length != 0) {
            window.alert("chon version");
        } else {
            const fetchData = async () => {
                try {
                    const user = JSON.parse(localStorage.getItem('user'));
                    let item = { cust_id: user.user_id, album_physi_id: album_phys_id, price: (price ? price : data.max_price), num: value };

                    const response = await axiosInstance("/api/addtocart", {
                        method: 'POST',
                        data: item
                    });

                    const result = response.data
                    const errorString = result['message'] ? result['message'] : '';
                    window.alert(errorString);


                } catch (error) {
                    console.error('Error:', error);
                }
            };

            fetchData();
        }
    };


    const [artists, setArtists] = useState('artist name');

    useEffect(() => {
        const fetchData = async () => {
            try {
                let item = { album_physi_id: album_phys_id };
                const response = await axiosInstance("/api/getalbumphys", {
                    method: 'POST',
                    data: item
                });

                const result = response.data
                setLoad(true);
                setData(result);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        const fetchData1 = async () => {
            try {
                let item = { album_physi_id: album_phys_id };
                const response = await axiosInstance("/api/checkVersion", {
                    method: 'POST',
                    data: item
                });

                const result = response.data
                setLoad3(true);
                sethasVer(result);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData1();
    }, []);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios('https://accounts.spotify.com/api/token', {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + btoa(Spotify.ClientID + ':' + Spotify.ClientSecret)
                    },
                    data: 'grant_type=client_credentials',
                    method: 'POST'
                });

                const artistResponse = await axios(`https://api.spotify.com/v1/artists/${data.artist_id}`, {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + response.data.access_token }
                });

                setArtists(artistResponse.data.name);
                setLoad2(true);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchArtists();
    });

    if (!load || !load2 || !load3) return <Loading />;



    return (
        <div className='h-screen overflow-y-scroll'>
            <Headers />
            <div className='flex justify-between w-full h-[10%] mt-3 items-center'>
                <div className='text-[#EE5566] ml-5 flex items-center'>
                    <NavLink to={'/albums'} className='hover:underline'>Albums</NavLink>
                    <MdOutlineNavigateNext className='mt-1 text-white text-lg' />
                    <div className='text-white'>{data.album_name}</div>
                </div>
                <div className='mr-4 '>
                    <div className="flex gap-2 ml-4">
                        <button onClick={() => { navigate('/shoppingcart') }} className={`text-[#EE5566] bg-[#131313] hover:bg-[#262626] rounded-full h-10 w-10 flex justify-center items-center hover:text-lg active:bg-[#EE5566] active:text-white`}>
                            <FaShoppingCart className='text-xl font-semibold' />
                        </button>
                    </div>

                </div>
            </div>
            <div className='flex mt-6 justify-between'>
                <div className='flex flex-col ml-5 gap-4'>
                    <div className="text-white text-xl font-medium">{data.album_name}</div>
                    <NavLink to={`/artist/${data.artist_id}`} className="text-[#EE5566] text-base font-bold hover:underline cursor-pointer">{artists}</NavLink>
                    <div class="w-[500px] h-10 bg-zinc-300 bg-opacity-10 flex item-center">
                        <div className='text-[#EE5566] font-semibold text-xl h-full flex items-center w-full ml-3'>
                            {(activeButton == '' && clickCount == 0) ? ((hasVer.length != 0) ? `${data.min_price} - ${data.max_price}` : `${data.min_price}`) : price} VND
                        </div>
                    </div>
                    {(hasVer.length != 0) ?
                        <div className='flex gap-6 items-center'>
                            <div class="text-white text-base font-medium">Version</div>
                            {hasVer.map((item, index) => {
                                return (
                                    <div
                                        className={`w-[160px] h-[37px] flex rounded-[50px] border-2 border-[#EE5566] justify-center items-center cursor-pointer select-none
                                            ${activeButton.includes(`${item.variant_name}`) ? 'text-white bg-[#EE5566]' : 'text-[#EE5566]'
                                            }`}
                                        onClick={() => handleClick(`${item.variant_name}`)}
                                    >
                                        <div className="text-sm font-semibold">{item.variant_name}</div>
                                    </div>
                                )

                            })}
                        </div>
                        : ''
                    }

                    <div className='flex gap-10 items-center'>
                        <div class="text-white text-base font-medium">Quantity</div>
                        <div>
                            <input
                                className='w-[60px] h-[30px] rounded-md px-3'
                                type="number"
                                value={value}
                                onChange={(e) => setValue(parseInt(e.target.value))}
                                min={0}
                            />
                        </div>
                        <div class="text-white text-lg font-medium">{(activeButton == '' && clickCount == 0) ? ((hasVer.length != 0) ? `${data.quantity}` : `${data.quantity}`) : quan} available products</div>
                    </div>
                    <div className='flex gap-10 mt-10 '>
                        <div class="w-[172px] h-9 text-[#EE5566] flex rounded-[50px] border-2 border-[#EE5566] justify-center items-center cursor-pointer select-none hover:bg-[#262626]"
                            onClick={() => { handleAddtoCart() }}>
                            <FaShoppingCart className='text-lg font-semibold' />
                            <div class="text-sm font-semibold">Add to Cart</div>
                        </div>
                        <div class="w-[172px] h-9 flex bg-[#EE5566] rounded-[50px] justify-center items-center cursor-pointer select-none">
                            <div class="text-white text-sm font-semibold">Buy Now</div>
                        </div>
                    </div>
                </div>
                <div className='mr-28'>
                    <img className="w-[300px] h-[300px]" src={data.url_poster} />
                </div>
            </div>
            <hr className='text-white w-[65%] my-3 ml-5' />
            <div class="text-white text-base font-medium ml-5">Description</div>
            <div class="text-white text-sm font-light ml-5">{data.description}</div>


        </div>
    )
}

export default Albums