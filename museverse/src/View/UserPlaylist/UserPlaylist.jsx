import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Headers from '../Header/Header';
import UserPlaylistCard from './UserPlaylistCard';
import { BsThreeDots } from 'react-icons/bs';
import axiosInstance from '../../API/axios';

function UserPlaylist() {
    const [playlistData, setPlaylistData] = useState({});
    const { playlistID } = useParams();
    const [selectedImage, setSelectedImage] = useState(null);
    const [image, setImage] = useState('');
    const user = localStorage.getItem('user');
    const userJson = JSON.parse(user);
    const userID = userJson.user_id;
    const [songId, setSongID] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            axiosInstance.get(`/api/getPlaylist?user_id=${userID}&playlist_id=${playlistID}`)
                .then(response => {
                    setPlaylistData(response.data);
                    setSongID([]);
                    setImage(response.data.picture);
                    if (response.data.song_id !== '') {
                        const songIdArray = response.data.song_id.split(',');
                        setSongID(songIdArray);
                    }
                })
                .catch(error => console.error('Error fetching playlist:', error));
        }
    }, [playlistID, user]);

    const handlePlaylistNameClick = () => {
        setIsEditing(true);
        setNewPlaylistName(playlistData.title_playlist);
    };

    const handlePlaylistNameChange = (e) => {
        setNewPlaylistName(e.target.value);
    };

    const handlePlaylistNameSave = () => {
        setIsEditing(false);
        setPlaylistData(prevData => ({
            ...prevData,
            title_playlist: newPlaylistName
        }));

        axiosInstance.post(`/api/changeTitle?user_id=${userID}&id=${playlistID}&title=${newPlaylistName}`)
    };

    const handlePlaylistNameBlur = () => {
        if (isEditing) {
            handlePlaylistNameSave();
        }
    };

    function handleExpanded() {
        setExpanded(!expanded);
    }

    function handleDelete() {
        setShowDeleteConfirmation(true);
    }

    function confirmDelete() {
        axiosInstance.post(`/api/removePlaylist?id=${playlistID}`)
            .then(response => {
            })
            .catch(error => console.error('Error deleting playlist:', error));

        setShowDeleteConfirmation(false);
        const path=`/`
        navigate(path)

    }

    function cancelDelete() {
        setShowDeleteConfirmation(false);
    }

    return (
        <div>
            <Headers bgColor={'#fd9869'} />
            <div style={{ background: `linear-gradient(#fd9869, #654ea3)` }} className='h-screen overflow-y-auto'>
                <div>
                    <div>
                        <div className='h-60 flex justify-center'>
                            <div className='w-11/12'>
                                <p className='text-white font-medium text-xl'>Playlist</p>
                                {isEditing ? (
                                    <div>
                                        <input
                                            type="text"
                                            value={newPlaylistName}
                                            onChange={handlePlaylistNameChange}
                                            onBlur={handlePlaylistNameBlur}
                                            className='bg-inherit text-white text-9xl font-bold w-7/12'
                                        />
                                    </div>
                                ) : (
                                    <p
                                        className='text-white font-bold text-9xl cursor-pointer pt-5'
                                        onClick={handlePlaylistNameClick}
                                    >
                                        {playlistData.title_playlist}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className='ml-16 pb-5 flex flex-row'>
                            <BsThreeDots onClick={handleExpanded} className='text-[#EE5566] text-3xl cursor-pointer'/>
                            {
                                expanded ?
                                <div className='bg-[#282828] ml-2 py-2 px-4 -mt-2'>
                                    <p onClick={handleDelete} className='text-white cursor-pointer'>Delete playlist</p>
                                </div>
                                :
                                ""
                            }
                        </div>
                        <div>
                        </div>
                        {
                            songId.length > 0
                            ?
                            <div className='flex flex-col gap-3 bg-black bg-opacity-20 items-center pb-32 pt-10'>
                                {songId.map(item => {
                                    return <UserPlaylistCard playlistID={playlistID} id={item} />;
                                })}
                            </div>
                            :
                            <div className='pt-10 flex justify-center items-center'>
                                <p className='text-white text-2xl font-semibold'>Your playlist has empty track</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {showDeleteConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-black rounded-lg p-8 shadow-md w-64">
                  <p className="text-xl text-[#EE5566] font-semibold mb-4">Are you sure you want to delete this playlist?</p>
                  <div className="flex justify-center">
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
                      onClick={confirmDelete}
                    >
                      Yes
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-500"
                      onClick={cancelDelete}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>
    );
}

export default UserPlaylist;
