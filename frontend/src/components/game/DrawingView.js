import { useState, useRef } from 'react'
import DraggableShape from './DraggableShape';
import AddShapeButton from '../UI/AddShapeButton';
import DeleteButton from '../UI/DeleteButton';
import Timer from './Timer';
import DrawingMenu from './DrawingMenu';
import { PostRequestData } from '../../helpers/postRequestCSRF';

const colors = ['orange','yellow', 'green', 'sky', 'blue', 'purple' ]

const DrawingView = props => {

    const [shapes, updateShapes] = useState([])
    const [menuOpen, setMenuOpen] = useState(false)
    const [isActive, setIsActive] = useState(true)

    // toggle the menu
    const openMenuHandler = () => {
        setMenuOpen( prev => !prev )
    }

    // this number must always increase, no matter how many shapes are added / deleted
    const [shapeNumber, setShapeNumber] = useState(0)

    // add shape
    const addShape = (shapeType) => {
        if (isActive) {

            setMenuOpen(false)
            updateShapes( prevShapes => {
                return [...prevShapes, 
                    {id: 'ref-' + shapeNumber, type: shapeType}
                ]
            } )
            setShapeNumber(prev => prev + 1)
        }
    }

    // delete functionality
    const deleteRef = useRef();

    const checkPosition = (event, id) => {

        let deleteTop = deleteRef.current.getBoundingClientRect().top 
        let deleteLeft = deleteRef.current.getBoundingClientRect().left 

        // when the shape enters the trigger area near the delete button:
        if(Math.abs(event.x - deleteLeft) < 70 && Math.abs(deleteTop - event.y) - event.height < 70 ) {

            updateShapes(prev => {
                // find the element with that id
                prev.forEach((el, i) => {
                    if (el.id === id) {
                        // the element is removed
                        prev.splice(i, 1);
                    }
                })
                // a new array is generated preserving the same ids
                let newArray = prev.map( (shapeId) => shapeId)
                return newArray
            })
        }
    }

    // tutorial
    let isTutorialActive = shapes.length === 0 ? true : false

    // send the drawing when the button is clicked or the timer ends
    const drawingEnds = () => {
        setIsActive(false)
    }

    // send drawing
    if (!isActive) {

        let shapesData = {
            'container-width': 120,
            'container-height': 160,
            'shapes': []
        }

        if (shapes.length > 0) {
            let startW = 0;
            let endW = 0;
            let startH = 0;
            let endH = 0;
    
            shapes.forEach(shape => {
                let shapeEl = document.getElementById(shape.id)
    
                if (startW === 0 || shapeEl.getBoundingClientRect().left < startW) {
                    startW = shapeEl.getBoundingClientRect().left
                }
    
                if (endW === 0 || shapeEl.getBoundingClientRect().left + shapeEl.offsetWidth > endW) {
                    endW = parseInt(shapeEl.getBoundingClientRect().left + shapeEl.offsetWidth)
                }
    
                if (startH === 0 || shapeEl.getBoundingClientRect().top < startH) {
                    startH = shapeEl.getBoundingClientRect().top
                }
    
                if (endH === 0 || shapeEl.getBoundingClientRect().top + shapeEl.offsetHeight > endH) {
                    endH = parseInt(shapeEl.getBoundingClientRect().top + shapeEl.offsetHeight)
                }
            })
    
            // create the overall dimentions of the container of all shapes
            let containerWidth = endW - startW
            let containerHeight = endH - startH
    
            shapesData = {
                'window-width': window.innerWidth, 
                'window-height': window.innerHeight, 
                'container-width': containerWidth,
                'container-height': containerHeight,
                'shapes': []
            }
    
            shapes.forEach(shape => {
                let shapeEl = document.getElementById(shape.id)
                // elleft - startW : x = containerw : 100
                shapesData = { ...shapesData,
                    'shapes': [...shapesData.shapes, {
                        'type': shape.type,
                        'top': Math.floor((shapeEl.getBoundingClientRect().top - startH) * 100 / containerHeight),
                        'left': Math.floor((shapeEl.getBoundingClientRect().left - startW) * 100 / containerWidth),
                        'classes': shapeEl.classList
                    }]
                }
            })
        } 

        fetch('save-drawing/' + props.session.player_id, {
            ...PostRequestData(),
            body: JSON.stringify({
                'session_code': props.session.code,
                'drawing-data': shapesData,
                'turn': props.turn.index,
                'word': props.turn.wordToDraw
            })
        })
        .then((response) => response.json())
        .then(data => {
            if(data.error) {
                console.log(data.error)
            }
            else {
                props.setTurn(prev => {
                    return {...prev, phase: 'waiting-drawing'}
                })
            }
        })
    }

    return (
        <div className='drawing-wrapper flex flex-col'>
            <div className='flex justify-between mt-14 mx-5 lg:w-full mb-2'>
                <div>
                    <p>You're drawing: 
                        <span className='font-bold'> {props.turn.wordToDraw ? props.turn.wordToDraw  : 'Dog' }</span>
                    </p>
                    <Timer maxTime={60} isActive={true} timerEndCallback={drawingEnds} />
                </div>
                <button className='add-shape w-[40px] h-[40px] z-[99999]' onClick={openMenuHandler} >
                    { menuOpen ? <div>X</div> : <AddShapeButton />}
                </button>
            </div>
            <DrawingMenu isOpen={menuOpen} addShape={addShape} />
            
            <div className='bg-blue bg-sky bg-orange bg-yellow bg-green bg-purple'></div>
            <div className='w-full flex-grow'>
                { isTutorialActive && 
                    <div className='absolute w-[190px] center-x top-[30%] cursor-pointer' onClick={openMenuHandler}>
                        <p className='text-center font-mono text-mid'>Start by adding a shape</p>
                        <div className='w-[122px] relative mx-auto mt-3'>
                            <AddShapeButton />
                        </div>
                        <p className='text-center'>Drag the shapes around or click them to change color</p>
                    </div>
                }
                <div id="shapes-container" className='h-full mx-5 top-0'>
                    {shapes.length > 0 && shapes.map((shape, i) => {
                        return <DraggableShape 
                            type={shape.type} 
                            key={shape.id} 
                            id={shape.id} 
                            colors={colors} 
                            classes={''} 
                            onDragEndHandler={checkPosition} 
                            index={i} 
                            />
                        })
                    }
                </div>
            </div>

            <div className='fixed bottom-0 right-0 pb-[80px] w-full'>
                <div className='w-fill flex justify-between mx-5 items-end'>
                    <button id="delete" ref={deleteRef} className="block">
                        <DeleteButton />
                    </button>
                    <button className='button bg-dark' onClick={drawingEnds}>done</button>
                </div>
            </div>
        </div>

    )
}

export default DrawingView;