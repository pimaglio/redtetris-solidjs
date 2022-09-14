import { createResource, lazy } from "solid-js";
import { Route, Routes } from "@solidjs/router"
// context
import { useGameDispatch, useGameState } from "../context/game";
// pages
const Home = lazy(() => import("../pages/home"));
const Room = lazy(() => import("../pages/room"));

// ----------------------------------------------------------------------

export default function AppRouter() {
    const {joinRoom} = useGameDispatch()
    const {room, player} = useGameState()

    async function RoomData({params, location, navigate, data}) {
        console.log('FETCH ROOM DATA', params.room)
        const pathRegex = /(.+)\[(.+)]/i;
        const paramsParsed = params.room.match(pathRegex);
        if (!paramsParsed) navigate('/', { replace: true })
    }

    return (
        <Routes>
            <Route exact path="/" component={Home}/>
            <Route path="/:room" component={Room} data={RoomData}/>
        </Routes>
    )
}
