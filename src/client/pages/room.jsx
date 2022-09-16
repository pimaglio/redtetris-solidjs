import { createEffect, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
// components
import TetrisLoader from "../components/shared/Loader/TetrisLoader";
import { GameWrapper } from "../components/Game";
// context
import { useGameDispatch, useGameState } from "../context/game";
import { ButtonSpinner } from "../components/shared/Buttons";

// ----------------------------------------------------------------------

export default function Room() {
    const {room, isLoading} = useGameState()
    const {handleKeyActions, startGame} = useGameDispatch()
    const navigate = useNavigate();


    createEffect(() => {
        if (!room) navigate('/', {replace: true})
    })

    const handleStartGame = (e) => {
        e.preventDefault()
        startGame()
    }

    return (
        <Show when={!isLoading} fallback={<TetrisLoader/>} keyed>
            <div class={'h-screen outline-0'} onKeyDown={(e) => handleKeyActions(e.key)} tabIndex={0}>
                <GameWrapper />
                <ButtonSpinner type={'button'} onClick={handleStartGame} name={'Start game'}/>
            </div>
        </Show>

    );
}
