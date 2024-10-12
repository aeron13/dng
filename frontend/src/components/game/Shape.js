import { Fragment } from "react";
import CircleBig from "./shapes/CircleBig";
import Triangle from "./shapes/Triangle";
import Hline from "./shapes/Hline";
import Wline from "./shapes/Wline";
import Rectangle from "./shapes/Rectangle";
import CircleSmall from "./shapes/CircleSmall";

const Shape = props => {
    return (
        <Fragment>
            <div className={props.color}>
                {props.shapeType === 'circle-big' && <CircleBig /> }
                {props.shapeType === 'circle-small' && <CircleSmall /> }
                {props.shapeType === 'rectangle' && <Rectangle /> }
                {props.shapeType === 'triangle' && <Triangle /> }
                {props.shapeType === 'h-line' && <Hline /> }
                {props.shapeType === 'w-line' && <Wline /> }
            </div>
        </Fragment>
    )
}

export default Shape;