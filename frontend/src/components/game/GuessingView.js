import { Fragment } from "react"
import Drawing from "./Drawing"

const GuessingView = props => {

    const drawing = props.turn.drawingToGuess 

    const checkWord = event => {
        event.preventDefault()
        let word = event.target.querySelector("#word-guess").value.trim()
        if (word.length > 0) {
            // save the turn and check the word
            if(word.toLowerCase() === props.turn.wordToGuess) {
                props.setTurn(prev => {
                    return {...prev,
                        wordGuessed: word,
                        guessedRight: true,
                        phase: 'check-guessing',
                    }
                })
            } else {
                props.setTurn(prev => {
                    return {...prev,
                        wordGuessed: word,
                        phase: 'check-guessing',
                    }
                })
            }
        }
    }

    return (
        <Fragment>
            <div className="bg-sky opacity-40 fixed right-0 bottom-0 w-[90%] md:w-[50%] h-[50%] z-[-1] rounded-l-full"></div>
            <div className=''>
                <div className='mt-14 md:w-full mb-[34px] mx-5'>
                    <h2>Guess your friend’s drawing</h2>
                    <h3 className="mt-1 font-mono text-mid">What is this?</h3>
                </div>
                <Drawing data={drawing} />
                <form onSubmit={checkWord} className='pb-[120px] pt-[50px] mx-5'>
                    <div className="form-el">
                        <input id="word-guess" type="text" className="border border-dark p-1" placeholder="write a word"/>
                        <input type="submit" value="Check" className="bg-dark button w-fit mt-3"/>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}

export default GuessingView;