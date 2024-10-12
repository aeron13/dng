import { Fragment } from "react"
import Header from "../UI/Header"

const GameIntro = props => {

    const clickStartHandler = () => {
        props.setTurn(prev => {
            return {...prev, phase: 'drawing'}
        })
    }

    return (
        <Fragment>
            <Header />    
            <div className="mt-[160px]">
                <div className="absolute w-full aspect-square max-w-[400px] rounded-full bg-orange opacity-50 z-[-1] center-x"></div>
                <div className="mx-5 flex flex-col">
                    <p className="font-mono text-mid">Make your friends guess the word:</p>
                    <h1 className="text-center font-serif text-xl my-[60px] md:mt-[60px] md:mb-[30px]">{props.turn.wordToDraw ? props.turn.wordToDraw : 'Dog'}</h1>
                    <p className="w-full text-center mt-3">Combine the shapes and make a picture.</p>
                    <button className="button bg-dark mx-auto mt-5 md:mt-10 relative w-fit" onClick={clickStartHandler}>Start drawing</button>
                </div>
            </div>
        </Fragment>
    )
}

export default GameIntro;