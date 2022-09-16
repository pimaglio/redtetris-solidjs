// context
import { useGameState } from "../../context/game";
// components
import Cell from "./Cell";
import { createEffect, createMemo, For } from "solid-js";

// ----------------------------------------------------------------------

export default function Grid(props) {
    const gameState = useGameState()

    return (
        <div class={'inline-grid grid-cols-10 gap-px'}>
            {gameState.grid.map((row, y) =>
                row.map(
                    (cell, x) =>
                        <div className={'blockTint'} /> && (
                            <Cell spectre={props.isSpectrum} key={x} type={cell[0]} />
                        ),
                ),
            )}
        </div>
    )
}
