import DrawingView from "../components/game/DrawingView";
import GuessingView from "../components/game/GuessingView";
import WaitingDrawing from "../components/game/WaitingDrawing";
import CheckGuessing from "../components/game/CheckGuessing";
import GameIntro from "../components/game/GameIntro";
import WaitingEnd from "../components/game/WaitingEnd";
import { Fragment, useState } from "react";

const Game = props => {

    const generateDefaultTurn = (words) => {
        return {
            index: 1,
            phase: 'intro',
            wordToDraw: words[0],
            drawingToGuess: {},
            wordToGuess: words[1],
            wordGuessed: '',
            guessedRight: false,
        }
    }

    const [currentTurn, setCurrentTurn] = useState(generateDefaultTurn(props.session.words))

    return(
        <Fragment>
            { (currentTurn.phase === 'intro' && 
                <GameIntro turn={currentTurn} setTurn={setCurrentTurn} />)  
            || (currentTurn.phase === 'drawing' &&
                <DrawingView session={props.session} turn={currentTurn} setTurn={setCurrentTurn} />)
            || (currentTurn.phase === 'waiting-drawing' &&
                <WaitingDrawing session={props.session} turn={currentTurn} setTurn={setCurrentTurn} />) 
            || (currentTurn.phase === 'guessing' &&
                <GuessingView session={props.session} turn={currentTurn} setTurn={setCurrentTurn} />) 
            || (currentTurn.phase === 'check-guessing' &&
                <CheckGuessing generateDefaultTurn={generateDefaultTurn} turn={currentTurn} session={props.session} setTurn={setCurrentTurn} setSession={props.setSession} />) 
            || (currentTurn.phase === 'waiting-end' &&
                <WaitingEnd session={props.session} setTurn={setCurrentTurn} setSession={props.setSession} />) 
           } 
        </Fragment>
    )
}

export default Game;