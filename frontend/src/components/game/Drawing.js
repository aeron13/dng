import { useState, useEffect } from "react"
import Shape from "./Shape"

const Drawing = props => {

    const drawing = props.data
 
    // shapes
    const shapes = drawing.shapes.map(shapeEl => {
        return {
            top: shapeEl.top  + '%',
            left: shapeEl.left + '%',
            type: shapeEl.type,
            classes: Object.values(shapeEl.classes)
        }
    })

    const setProportions = () => {

        const windowWidth = window.innerWidth < 1024 ? window.innerWidth : 1024
        let scalingFactor = 1;

        if (windowWidth - 40 < drawing['container-width']) scalingFactor = (windowWidth - 40) / drawing['window-width']

        return {
            drawingContainer: {
                height: drawing['container-height'], 
                width: drawing['container-width'], 
                position: 'absolute',
                transform: `scale(${scalingFactor})`
            },
            outerContainer: {
                height: drawing['container-height'] * scalingFactor +52 + 'px',
                width: drawing['container-width'] * scalingFactor +52 + 'px',
            }
        }
    }

    const [containerStyles, setContainerStyles] = useState(setProportions)

    // this makes sure that the div resizes when the window is reloaded
    useEffect( () => {
        const handleResize = () => {
            setContainerStyles(setProportions)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])


    return (
        <div className="mx-auto" style={containerStyles.outerContainer}>
            <div className="border border-dark bg-white p-[25px]" style={containerStyles.outerContainer} >
                <div className="drawing-container bg-white origin-top-left" style={containerStyles.drawingContainer} >
                    {shapes.length > 0 && shapes.map((shape, i) => {
                        return <div 
                            key={i} 
                            className={shape.classes.join(' ')} 
                            id={i} 
                            style={{top: shape.top, left: shape.left, position: 'absolute'}} 
                        >
                            <Shape shapeType={shape.type} />
                        </div>
                    }
                    )}
                </div>
            </div>
        </div>
    )
}

export default Drawing;