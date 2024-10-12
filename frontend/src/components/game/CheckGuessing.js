import { Fragment, useEffect } from "react"
import { PostRequestData } from "../../helpers/postRequestCSRF"
import Header from "../UI/Header"


const CheckGuessing = props => {

    useEffect( () => {
        fetch('update-turn/' + props.session.player_id, {
            ...PostRequestData(),
            body: JSON.stringify({
                'turn': props.session.turn,
                'drawing_guessed': props.turn.drawingToGuessId,
                'word_guessed': props.turn.wordToGuess,
                'guessed_right': props.turn.guessedRight,
            })
        })
    }, [props])

    const nextTurnHandler = () => {
        
        // if it's the last turn
        // deactivate the player
        if (props.session.turn === Math.floor(props.session.n_players / 2)) {
            props.setSession(prev => {
                return {...prev,
                    score: prev.score + props.turn.guessedRight ? 1 : 0
                }
            })
            props.setTurn(prev => {
                return {...prev,
                    phase: 'waiting-end'
                }
            })  

        } else {
            // prepare the next turn
            props.setTurn(prev => {

                let oldWords = props.session.words
                oldWords.splice((prev.index - 1) * 2, 2)
                let newTurn = props.generateDefaultTurn(oldWords)

                return {...newTurn,
                    index: prev.index + 1
                }
            })  
            props.setSession(prev => {
                return {
                    ...prev,
                    turn: prev.turn + 1,
                    score: prev.score + props.turn.guessedRight ? 1 : 0
                }
            })
        }
    }

    return (
        <Fragment>
            <Header />
            <div className="mt-[160px]">
                <div className="w-full aspect-square max-w-[400px] rounded-full bg-sky flex justify-center flex-col items-center relative mx-auto">
                    {props.turn.guessedRight 
                        ? <h1 className="text-center font-serif text-xl my-[100px] md:mt-[60px] md:mb-[30px]">That's right!!</h1>
                        : <div className="">
                            <h1 className="font-serif text-xl">mmm...</h1>
                            <p>Looks like it was something else.</p>
                        </div>
                    }
                </div>
                <div className="relative top-[-100px]">
                    <div className="w-[40%] float-right">
                        <button className="button bg-dark ml-auto" onClick={nextTurnHandler}>Next turn</button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default CheckGuessing;