import Triangle  from './menu-shapes/triangle.svg';
import CircleBig from './menu-shapes/circle-big.svg';
import CircleSmall from './menu-shapes/circle-small.svg';
import LineH from './menu-shapes/h-line.svg';
import LineW from './menu-shapes/w-line.svg';
import Rectangle from './menu-shapes/rectangle.svg';

const DrawingMenu = props => {

    const addShapeHandler = event => {
        props.addShape(event.target.id)
    }

    return (
        <div id="drawing-menu" className={`h-screen w-screen z-[999] bg-orange fixed top-0 left-0 ${ !props.isOpen && 'hidden' }`}>
            <div className='w-full h-full flex flex-col justify-center items-center pb-[150px] pt-[100px]'>
                <h2 className="text-mid font-mono text-center ">Add shape</h2>
                <ul className="flex flex-col justify-center items-center mt-[45px] gap-[40px]">
                    <li>
                        <button onClick={addShapeHandler}><img id="triangle" alt="triangle" src={Triangle} /></button>
                    </li>
                    <li>
                        <button onClick={addShapeHandler}><img id="rectangle" alt="rectangle" src={Rectangle} /></button>
                    </li>
                    <li>
                        <button onClick={addShapeHandler}><img id="circle-big" alt="big circle" src={CircleBig} /></button>
                    </li>
                    <li>
                        <button onClick={addShapeHandler}><img id="circle-small" alt="small circle" src={CircleSmall} /></button>
                    </li>
                    <li>
                        <button onClick={addShapeHandler}><img id="h-line" alt="vertical line" src={LineH} /></button>
                    </li>
                    <li>
                        <button onClick={addShapeHandler}><img id="w-line" alt="horizontal line" src={LineW} /></button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default DrawingMenu;