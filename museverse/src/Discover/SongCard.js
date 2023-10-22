export default function SongCard() {

    return (
        <div className="flex flex-col w-[200px] bg-cover bg-center bg-no-repeat bg-[url('https://stc-social.1vn.app/nKWHe0/w640_jpg/0ed79a8496c07f9e26d1')] bg-opacity-80 
        backdrop-blur-sm animate-slideup rounded-lg cursor-pointer h-72">
            <div className="absolute bottom-0 w-full h-24">
                <div className={`text-white absolute inset-0 bg-black/50 backdrop-blur-sm group-hover:flex`}>
                    <p className="text-xs font-normal text-[#EF2F62]">New For You</p>
                    <h1 className="font-semibold">My New Arrivals</h1>
                    <div className="text-sm font-semibold text-[#9898A6]">
                        <p>Deine Freunde, Moderat,</p> 
                        <p>Sebastian Yatra and more</p>
                    </div>
                </div>
            </div>
        </div>
    )
}