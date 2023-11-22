import { useEffect } from "react";

import Headers from "../Header/Header";

export default function Discover() {
    return(
        <div>
            <Headers />
            <div className="flex flex-wrap sm:justify-start justify-center items-center gap-8 pt-12 pl-5 overflow-y-scroll h-screen">
                <h1 className="text-white font-bold text-lg">Discover session</h1>
            </div>
        </div>
    )
}