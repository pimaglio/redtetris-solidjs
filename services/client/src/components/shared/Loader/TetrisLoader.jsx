// styles
import './TetrisLoader.css'

// ----------------------------------------------------------------------

export default function TetrisLoader() {
    return (
        <div className={'h-screen w-screen overflow-hidden flex items-center justify-center'}>
            <div>
                <div className="tetris">
                    <div className="block1" />
                    <div className="block2" />
                    <div className="block3" />
                    <div className="block4" />
                </div>
                <p class={'text-sm text-gray-700'}>Chargement en cours...</p>
            </div>

        </div>

    )
}
