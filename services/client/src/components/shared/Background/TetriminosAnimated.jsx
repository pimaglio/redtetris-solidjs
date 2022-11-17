import './tetriminosAnimated.css'

export default function TetriminosAnimated() {
    return (
        <div className={'fade-in2'} style={{ zIndex: 0 }}>
            <div id='p1'>
                <div className='box color'></div>
                <div className="box color"></div>
                <div className='box color'></div>
                <div className='box color bendy'></div>
            </div>
            <div id='p2'>
                <div className='box color2'></div>
                <div className='box color2'></div>
                <div className="box color2"></div>
                <div className='box color2 bendy2'></div>
            </div>
            <div id='p3'>
                <div className='box color3'></div>
                <div className='box color3'></div>
                <div className='box color3'></div>
                <div className='box color3'></div>
            </div>
            <div id='p4'>
                <div className='box color4'></div>
                <div className='box color4'></div>
                <div className='box color4 bendy4b'></div>
                <div className='box color4 bendy4'></div>
            </div>
            <div id='p5'>
                <div className='box color5'></div>
                <div className='box color5'></div>
                <div className='box color5 bendy5b'></div>
                <div className='box color5 bendy5'></div>
            </div>
        </div>
    )
}
