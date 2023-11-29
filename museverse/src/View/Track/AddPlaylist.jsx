import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { TiTick } from "react-icons/ti";
import { FaTimes } from "react-icons/fa";

function AddPlaylist({title, id, trackID}) {
    const [added, setAdded] = useState(false)

    useEffect(()=> {
        axios.get(`http://127.0.0.1:8000/api/checkSongID?id=${id}&song_id=${trackID}`).then(response => {
            if(response.data == "Yes") {
                setAdded(true)
            } else {
                setAdded(false)
            }
        })
    },[])

    function addPlaylist(id) {
        axios.post(`http://127.0.0.1:8000/api/addPlaylist?id=${id}&song_id=${trackID}`).then(response => {
            if(response.status === 200) {
                setAdded(true)
            }
        })
    }

    return (
        <div className="flex flex-row gap-2">
            <p className='text-white cursor-pointer' onClick={() => addPlaylist(id)}>{title}</p>
            {
                added ? <TiTick className='text-white mt-1'/> : <FaTimes className='text-white mt-1'/>
            }
        </div>
    )
}

export default AddPlaylist