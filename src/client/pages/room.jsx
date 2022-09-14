import { createEffect, onMount, Show } from "solid-js";
import { useNavigate, useRouteData } from "@solidjs/router";
// components
import TetrisLoader from "../components/shared/Loader/TetrisLoader";
import { useGameState } from "../context/game";

// ----------------------------------------------------------------------

export default function Room() {
    const { roomName, playerName } = useRouteData();
    const navigate = useNavigate();
    const {room, player, isLoading} = useGameState()

    createEffect(() => {
        if (!room) navigate('/', {replace: true})
        //console.log(room.name)
    })

    return (
        <Show when={!isLoading} fallback={<TetrisLoader/>} keyed>
            <section class="bg-gray-100 text-gray-700 p-8">
                <h1 class="text-2xl font-bold">RoomPage: {room.name}</h1>
                <p class="mt-4">This is the room page.</p>
            </section>
        </Show>

    );
}
