import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";

import { Spotify } from "../../API/Credentials"
import Loading from '../Loading/Loading'
import { capitalizeFirstLetter } from "../Playlist/SplitNumber";
import Headers from "../Header/Header";

function Related() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)

    const {artistID} = useParams()
    const navigate = useNavigate()

    function changeRoute(id) {
      const path=`/artist/${id}`
      navigate(path)
    }

    useEffect(() => {
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(Spotify.ClientID + ':' + Spotify.ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
        .then(response => {
            const token = response.data.access_token;
            axios(`https://api.spotify.com/v1/artists/${artistID}/related-artists`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setData(response.data.artists)
                setLoading(false)
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    }, [artistID]);

    if(loading) return <div><Loading /></div>
    return (
      <div>
        <Headers />
        <div className="h-screen overflow-y-scroll pb-32">
          <div className="flex justify-center">
            <div className="w-10/12 flex flex-row flex-wrap gap-7">
              {
                data.map(item => (
                  <div
                    className="bg-black bg-opacity-30 h-76 w-48 flex flex-col items-center rounded-lg gap-y-3 hover:bg-opacity-60 cursor-pointer"
                    //onMouseEnter={() => setIsHovered(true)}
                    //onMouseLeave={() => setIsHovered(false)}
                    onClick={() => changeRoute(item.id)}
                  >
                    <div className="relative overflow-hidden">
                      <img src={item.images[0].url} className="rounded-xl w-40 h-40 mt-3" alt={item.name} />
                    </div>
                    <div className="w-40 pb-4">
                      <div>
                        <h3 className="font-semibold text-base text-white">
                          {item.name.length > 15 ? item.name.slice(0, 15) + '...' : item.name}
                        </h3>
                        <p className="font-normal text-sm text-[#9898A6]">
                        {capitalizeFirstLetter(item.type)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    )
}

export default Related