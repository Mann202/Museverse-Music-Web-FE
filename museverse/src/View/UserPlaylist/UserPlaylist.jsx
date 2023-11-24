import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Headers from '../Header/Header';

function UserPlaylist() {
    const [playlistData, setPlaylistData] = useState({});
    const { playlistID } = useParams();
    const user = localStorage.getItem('user');
    const [selectedImage, setSelectedImage] = useState(null);
    const userJson = JSON.parse(user);
    const userID = userJson.user_id;

    useEffect(() => {
        if (user) {
            axios.get(`http://127.0.0.1:8000/api/getPlaylist?user_id=${userID}&playlist_id=${playlistID}`)
                .then(response => {
                    setPlaylistData(response.data);
                    console.log(response.data)
                })
                .catch(error => console.error('Error fetching playlist:', error));
        }
    }, [playlistID, user]);

    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleUploadImage = () => {
        if (selectedImage) {
            const formData = new FormData();
            formData.append('image', selectedImage);
            formData.append('user_id', userID); 
            formData.append('playlist_id', playlistID); 

            axios.post('http://127.0.0.1:8000/api/uploadImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((response) => {
                    alert(response.data.message);
                })
                .catch((error) => {
                    console.error('Error uploading image:', error);
                });
        }
    };

    return (
        <div>
            <Headers />
            <div className='h-screen overflow-y-auto'>
                <div>
                    <div>
                        <p className='text-white'>Playlist</p>
                        <p className='text-white'>{playlistData.title_playlist}</p>
                    </div>
                    <div>
                        <form encType="multipart/form-data">
                            <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                            <button type="button" className='text-white' onClick={handleUploadImage}>Upload Image</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPlaylist;
