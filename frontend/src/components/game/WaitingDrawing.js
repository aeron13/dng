import { Fragment } from "react"
import Header from "../UI/Header"

const WaitingDrawing = props => {

    const queryDrawing = () => {
        fetch("query-drawing/?player_id=" + props.session.player_id + "&word=" + props.turn.wordToGuess)
        .then((response) => response.json())
        .then(data => {
            if (data.message)
            {
                setTimeout(queryDrawing, 2000)
            }
            else {
                props.setTurn(prev => {
                    return {...prev,
                        drawingToGuess: data.drawing_data,
                        drawingToGuessId: data.drawing_id,
                        phase: 'guessing'
                    }
                })
            }
        })
    }
    queryDrawing()

    return (
        <Fragment>
            <Header />
            <div className="mt-[160px]">
                <div className="w-full aspect-square max-w-[400px] rounded-full bg-orange flex justify-center items-center relative mx-auto">
                    <h1 className="font-serif text-xl">
                        Well done !
                    </h1>
                </div>
                <div className="relative top-[-100px]">
                    <div className="w-[50%] float-right">
                        <p className="max-w-[70%]">Wait for everyone to send the drawing...</p>
                    </div>
                </div>
            </div>
        </Fragment>

    )
}

export default WaitingDrawing;