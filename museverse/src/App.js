import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";


import Headers from "./View/Header/Header";
import SideBar from "./View/SideBar/SideBar";
import Discover from "./View/Discover/Discover";
import Play from "./View/Play/Play"
import NotFound from './View/NotFound/NotFound'
import Chart from "./View/Chart/Chart";
import Search from "./View/Search/Search";
import Catelogy from "./View/Catelogy/Catelogy";
import Playlist from "./View/Playlist/Playlist";
import Artist from "./View/Artists/Artists";
import Discovery from "./View/Artists/Discovery/Discovery";
import Related from "./View/Artists/Related";
import AppearOn from "./View/Artists/AppearOn/AppearOn";
import Track from "./View/Track/Track";
import Album from "./View/Album/Album";
import AllAnotherAlbum from "./View/Album/AllAnotherAlbum";
import NewRelease from "./View/NewRelease/NewRelease";
import AllNewReleases from "./View/NewRelease/AllNewReleases";
import Profile from "./View/Profile/Profile";
import SignIn from "./View/Login-SignUp/SignIn";
import SignUp from "./View/Login-SignUp/SignUp";
import { LoggedContext } from './View/Login-SignUp/LoggedContext';
import Show from "./View/Show/Show";
import Episode from "./View/Episode/Episode";
import History from "./History/History";
import FollowedArtist from "./View/FollowedArtist/FollowedArtist";
import Lyric from "./View/Lyric/Lyric";
import Queue from "./View/Queue/Queue";
import LikedTrack from "./View/LikedTrack/LikedTrack";
import axios from "axios";
import UserPlaylist from "./View/UserPlaylist/UserPlaylist";
import SoldAlbum from "./View/SoldAlbum/SoldAlbum";
import SideBarForAdmin from "./View/SideBar/SideBarForAdmin";
import Dashboard from "./View/Admin/Dashboard/Dashboard";
import Distributor from "./View/Admin/DistributorsManagement/Distributor";
import Users from "./View/Admin/UsersManagement/Users";
import Report from "./View/Admin/Report/Report";
import NewDistributor from "./View/Admin/DistributorsManagement/NewDistributor";
import NewUser from "./View/Admin/UsersManagement/NewUser";
import StoreDistributor from './View/Distributor/Store/StoreDistributor';
import OrdersDistributor from './View/Distributor/OrdersDistributor/OrdersDistributor';
import ReportDistributor from './View/Distributor/ReportDistributor/ReportDistributor';
import SideBarForDistributor from './View/SideBar/SideBarForDistributor';
import NewProduct from "./View/Distributor/Store/NewProduct";
import EditProduct from "./View/Distributor/Store/EditProduct";
import SoldAlbumDetail from "./View/SoldAlbum/SoldAlbumDetail";
import ShoppingCart from "./View/SoldAlbum/ShoppingCart";
import CheckOut from "./View/SoldAlbum/CheckOut";
import OrderDetail from "./View/Distributor/OrdersDistributor/OrderDetail";
import NewOrder from "./View/Distributor/OrdersDistributor/NewOrder";
import OrderCheckout from "./View/Distributor/OrdersDistributor/OrderCheckout";
import PaymentResult from "./View/PaymentResult";
import PaymentAlbum from "./View/PaymentResult/PaymentAlbum";
import axiosInstance from "./API/axios";

function App() {
  const [playingTrack, setPlayingTrack] = useState('')
  const [queue, setQueue] = useState('')
  const [status, setStatus] = useState([])
  const [next, setNext] = useState(false)
  const [a, setA] = useState([])
  if (a.length === 0 && status.length > 0) {
    setA(status)
  }

  useEffect(() => {
    if (a.length > 0 && status.length > 0) {
      if (a[0].name != status[0].name && queue != '') {
        setPlayingTrack(queue)
        setNext(true)
        setQueue('')
      }
    }
  }, [status])

  const [playingID, setPlayingID] = useState('')
  const [trackInAlbum, setTrackInAlbum] = useState(0) //Lưu vào thứ tự phát của album khi được bấm (dùng để queue bài hát)
  const [isPlaying, setIsPlaying] = useState(true) //Lấy trạng thái của thanh nghe nhạc (Đang nghe hay đã dừng)
  const [playingData, setPlayingData] = useState([]) //Lưu vào track đang được nghe
  const [play, setPlay] = useState([]) //Cài đặt resume và pause
  const [playingAlbumID, setPlayingAlbumID] = useState('') //Lưu vào album id đang nghe
  const { logged } = useContext(LoggedContext)
  const [progressMs, setProgressMs] = useState(0) //Luu vao thoi gian nghe nhac
  const [device, setDevice] = useState('')
  const [ids, setIDs] = useState([])

  let userID = 0
  let accType = 0
  const user = localStorage.getItem('user')
  if (user != null) {
    const userJson = JSON.parse(user);
    userID = userJson.user_id;
    accType = userJson.accountTypeID;
  }

  useEffect(() => {
    if (playingData.length != 0 && playingData.id !== "") {
      axiosInstance.post(`/api/history`, {
        user_id: userID,
        track: playingData.id
      })
    }
  }, [playingData, userID]);

  return (
      <div className="relative flex">
          {logged ?
            (accType === 3 ? <SideBarForAdmin /> :
            accType === 4 ? <SideBarForDistributor /> :
            <SideBar />)
        : null}
      <div className="flex-1 flex flex-col bg-black">
        <div className="flex-1 pb-40">
          {
            (userID == 0) ?
            <Routes>
              <Route path="/" element={<Discover setPlayingTrack={setPlayingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum}/>} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/search" element={<Search />} />
              <Route path="/search/:searching" element={<Search setPlay={setPlay} setPlayingTrack={setPlayingTrack} isPlaying={isPlaying} playingData={playingData} />} />
              <Route path="/catelogy/:catelogyID" element={<Catelogy setPlayingTrack={setPlayingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum} />} />
              <Route path="/playlist" element={<Playlist />} />
              <Route path="/playlist/:playlistID" element={<Playlist setIsPlaying={setIsPlaying} setPlay={setPlay} playingData={playingData} setPlayingTrack={setPlayingTrack} playingTrack={playingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum} isPlaying={isPlaying} />} />
              <Route path="/artist/" element={<Artist />} />
              <Route path="/artist/:artistID" element={<Artist />} />
              <Route path="/artist/:artistID/discovery-all" element={<Discovery />} />
              <Route path="/artist/:artistID/all-albums" element={<AllAnotherAlbum />} />
              <Route path="/artist/:artistID/related-artists" element={<Related />} />
              <Route path="/artist/:artistID/appear-on" element={<AppearOn />} />
              <Route path="/chart/" element={<Chart setPlayingTrack={setPlayingTrack} />} />
              <Route path="/track" element={<Track setPlayingTrack={setPlayingTrack} setPlayingID={setPlayingID} playingID={playingID} />}></Route>
              <Route path="/track/:trackID" element={<Track playingData={playingData} isPlaying={isPlaying} setPlay={setPlay} setPlayingTrack={setPlayingTrack} />}></Route>
              <Route path="/album/" element={<Album />} />
              <Route path="/album/:albumID" element={<Album playingData={playingData} setTrackInAlbum={setTrackInAlbum} isPlaying={isPlaying} setPlayingTrack={setPlayingTrack} play={play} setPlay={setPlay} playingAlbumID={playingAlbumID} setPlayingAlbumID={setPlayingAlbumID} />} />
              <Route path="/newrelease/" element={<NewRelease />} />
              <Route path="/allnewrelease/" element={<AllNewReleases />} />
              <Route path="/followedArtists" element={<FollowedArtist />} />
              <Route path="/history" element={<History setIsPlaying={setIsPlaying} setPlay={setPlay} playingData={playingData} setPlayingTrack={setPlayingTrack} playingTrack={playingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum} isPlaying={isPlaying} />} />
              <Route path="/albums/" element={<SoldAlbum />} />
              <Route path="/episode/:episodeID" element={<Episode playingData={playingData} isPlaying={isPlaying} setPlay={setPlay} setPlayingTrack={setPlayingTrack} />} />
              <Route path="/*" element={<NotFound />} />
        </Routes>
            :
            (accType == 3) ?
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/distributors" element={<Distributor />} />
                <Route path="/distributors/NewDistributor" element={<NewDistributor />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/NewUser" element={<NewUser />} />
                <Route path="/report" element={<Report />} />
                <Route path="/*" element={<NotFound />} />
              </Routes>
              :
              (accType == 4) ?
                <Routes>
                  <Route path="/" element={<StoreDistributor />} />
                  <Route path="/orders" element={<OrdersDistributor />} />
                  <Route path="/report" element={<ReportDistributor />} />
                  <Route path="/newProduct" element={<NewProduct />} />
                  <Route path="/editProduct/:newProductID" element={<EditProduct />} />
                  <Route path="/orderdetail/:order_id" element={<OrderDetail />} />
                  <Route path="/orders/neworder" element={<NewOrder />} />
                  <Route path="/orders/neworder/checkout" element={<OrderCheckout />} />
                  <Route path="/*" element={<NotFound />} />
                </Routes>
                :
                <Routes>
                  <Route path="/" element={<Discover setPlayingTrack={setPlayingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum}/>} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/search/:searching" element={<Search setPlay={setPlay} setPlayingTrack={setPlayingTrack} isPlaying={isPlaying} playingData={playingData} />} />
                  <Route path="/catelogy/:catelogyID" element={<Catelogy setPlayingTrack={setPlayingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum} />} />
                  <Route path="/playlist" element={<Playlist />} />
                  <Route path="/playlist/:playlistID" element={<Playlist setIsPlaying={setIsPlaying} setPlay={setPlay} playingData={playingData} setPlayingTrack={setPlayingTrack} playingTrack={playingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum} isPlaying={isPlaying} />} />
                  <Route path="/artist/" element={<Artist />} />
                  <Route path="/artist/:artistID" element={<Artist />} />
                  <Route path="/artist/:artistID/discovery-all" element={<Discovery />} />
                  <Route path="/artist/:artistID/all-albums" element={<AllAnotherAlbum />} />
                  <Route path="/artist/:artistID/related-artists" element={<Related />} />
                  <Route path="/artist/:artistID/appear-on" element={<AppearOn />} />
                  <Route path="/chart/" element={<Chart setPlayingTrack={setPlayingTrack} />} />
                  <Route path="/track" element={<Track setPlayingTrack={setPlayingTrack} setPlayingID={setPlayingID} playingID={playingID} />}></Route>
                  <Route path="/track/:trackID" element={<Track playingData={playingData} isPlaying={isPlaying} setPlay={setPlay} setPlayingTrack={setPlayingTrack} />}></Route>
                  <Route path="/album/" element={<Album />} />
                  <Route path="/album/:albumID" element={<Album playingData={playingData} setTrackInAlbum={setTrackInAlbum} isPlaying={isPlaying} setPlayingTrack={setPlayingTrack} play={play} setPlay={setPlay} playingAlbumID={playingAlbumID} setPlayingAlbumID={setPlayingAlbumID} />} />
                  <Route path="/newrelease/" element={<NewRelease />} />
                  <Route path="/allnewrelease/" element={<AllNewReleases />} />
                  <Route path="/followedArtists" element={<FollowedArtist />} />
                  <Route path="/history" element={<History setIsPlaying={setIsPlaying} setPlay={setPlay} playingData={playingData} setPlayingTrack={setPlayingTrack} playingTrack={playingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum} isPlaying={isPlaying} />} />
                  <Route path="/track/lyric" element={<Lyric playingData={playingData} setProgressMs={setProgressMs} isPlaying={isPlaying} progressMs={progressMs} device={device} />} />
                  <Route path="/queue/" element={<Queue setIDs={setIDs} ids={ids} queue={queue} next={next} setNext={setNext} playingData={playingData} playingTrack={playingTrack} setQueue={setQueue} setPlayingTrack={setPlayingTrack} device={device} />} />
                  <Route path="/likedTracks/" element={<LikedTrack setIsPlaying={setIsPlaying} setPlay={setPlay} playingData={playingData} setPlayingTrack={setPlayingTrack} playingTrack={playingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum} isPlaying={isPlaying} />} />
                  <Route path="/user-playlist/:playlistID" element={<UserPlaylist />} />
                  <Route path="/albums/" element={<SoldAlbum />} />
                  <Route path="/episode/:episodeID" element={<Episode playingData={playingData} isPlaying={isPlaying} setPlay={setPlay} setPlayingTrack={setPlayingTrack} />} />
                  <Route path="/albums/" element={<SoldAlbum />} />
                  <Route path="/albumsdetails/:album_phys_id" element={<SoldAlbumDetail />} />
                  <Route path="/shoppingcart/" element={<ShoppingCart />} />
                  <Route path="/shoppingcart/checkout/" element={<CheckOut />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/payment/result" element={<PaymentResult />} />
                  <Route path="/payment/album" element={<PaymentAlbum />} />
                  <Route path="/*" element={<NotFound />} />
            </Routes>
            }
          </div>
        </div>
        <div className="fixed bottom-0 w-full">
            <Play setPlayingID={setPlayingID} setPlayingTrack={setPlayingTrack} playingData={playingData} play={play} isPlaying={isPlaying} setPlayingData={setPlayingData} playingTrack={playingTrack} trackInAlbum={trackInAlbum} setIsPlaying={setIsPlaying} setStatus={setStatus} setProgressMs={setProgressMs} setDevice={setDevice}/>
        </div>
      </div>
    // </div>
  );
}

export default App;
