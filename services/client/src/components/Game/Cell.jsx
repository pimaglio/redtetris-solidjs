// context
import { useGameState } from "../../context/game";
// constants
import { TETRIMINO_LIST } from "../../constants/tetriminos";

// ----------------------------------------------------------------------

export default function Cell(props) {
    const cellColor = TETRIMINO_LIST[props.type].color
    console.log('RE RENDER', props.type)

    return (
        <div class={`p-4 ${cellColor}`}/>
    )
}
