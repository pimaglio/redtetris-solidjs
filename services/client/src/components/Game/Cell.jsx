// context
import { useGameState } from "../../context/game";
// constants
import { TETRIMINO_LIST } from "../../constants/tetriminos";

// ----------------------------------------------------------------------

export default function Cell(props) {
    const cellColor = TETRIMINO_LIST[props.type].color

    return (
        <div class={`p-4 ${cellColor}`}/>
    )
}
