import { useState } from "react";
import { Draggable } from 'drag-react';
import Shape from "./Shape";

const DraggableShape = props => {

    const [color, setColor] = useState(0)

    // prevent click event to happen also on dragEnd
    let isClicked = false;
    const checkClick = () => {
        isClicked = true;
        setTimeout(() => {isClicked = false}, 300)
    }

    // change color class on click
    const changeColor = event => {
        if (isClicked) {
            event.target.classList.remove('shape-' + props.colors[color])
            setColor( prev => {
                if (prev === props.colors.length - 1) return 0
                else return prev + 1
            })
            event.target.classList.add('shape-' + props.colors[color])
        }
    }

    // check if the element should be deleted on every drag-end event
    const dispatchDelete = event => {
        props.onDragEndHandler(event, props.id)
    }

    return(
        <Draggable onDragEnd={dispatchDelete} style={{top: '150px', left: '50%', transform: 'translate(-50%)', zIndex: '9'}} >
            <div className={`${props.classes} shape-${props.colors[color]}`} onMouseDown={checkClick} onMouseUp={changeColor} id={props.id}>
                <Shape shapeType={props.type} />
            </div>
        </Draggable>
    )
}

export default DraggableShape;