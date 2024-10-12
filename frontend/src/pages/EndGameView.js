import { useState, Fragment, useEffect } from "react";
import Drawing from "../components/game/Drawing";
import Header from "../components/UI/Header";
import { PostRequestData } from "../helpers/postRequestCSRF";


const EndGameView = props => {

    const [data, setData] = useState({drawings: [], winners: []})

    useEffect(() => {
        fetch('/end-session/' + props.session.player_id)
        .then((response) => response.json())
        .then(responseData => {
            if (responseData.drawings) {
    
                console.log(responseData.drawings)
                
                setData({
                    drawings: responseData.drawings,
                    winners: responseData.winners
                })
            }
        })
    }, [props.session.player_id])

    // play again functionality
    const playAgainHandler = () => {
        fetch('/reset-session/' + props.session.player_id, PostRequestData())
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            props.setSession(prev => {
                return {...prev,
                    turn: 0
                }
            })
        })
    }

    return (
        <Fragment>
            <Header />  
            <div className="bg-orange opacity-40 fixed right-0 bottom-0 w-[65%] h-[60%] md:h-[30%] z-[-1] rounded-tl-[100%]"></div>
            { !data.drawings && <div className="mt-[107px] mx-5"><p className="font-mono text-mid">Waiting for the results...</p></div> } 
            { data.drawings && 
                <Fragment>
                    { data.winners.length > 0 && 
                        <div className="mt-[107px]">
                            <div className="mx-5 relative">
                                <p className="md:w-[50%] md:text-right absolute z-10">
                                    {data.winners.length > 1 ? 'Aand the winners are: ' : 'Aand the winner is: '}
                                </p>
                            </div>
                            <div className="w-full aspect-square max-w-[400px] rounded-full bg-orange flex justify-center items-center relative mx-auto">
                                <h1 className="font-serif text-xl text-center">
                                    {data.winners.map((name, i) => <p key={i}>{name}{ i !== data.winners.length - 1 && ','}</p> )}
                                </h1>
                            </div>
                        </div>
                    }
                    <div className="mx-5 mt-[135px]">
                        <h2 className="font-mono text-mid mb-[38px]">Look at all the drawings: </h2>
                    </div>
                    {data.drawings.map((drawing, i) => {
                        return (
                        <div key={i} className="mb-[75px]">
                            <Drawing data={drawing.picture} key={i} />
                            <h3 className="mx-5 mt-2">
                                <span className="font-mono text-mid px-1 mr-1 bg-dark text-white">{drawing.word}</span> 
                                by {drawing.player}
                            </h3>
                        </div>)
                        }
                    )}
                    <div className="mx-5 text-center my-[20vh]">
                        <button className="button-xl bg-orange" onClick={playAgainHandler}>Play again</button>
                    </div>
                </Fragment>
            }
        </Fragment>
    )
}

export default EndGameView;