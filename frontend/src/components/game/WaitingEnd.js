import { Fragment } from "react"
import Header from "../UI/Header"

const WaitingEnd = props => {

    const queryEnd = () => {
        fetch('/end-player-game/' + props.session.player_id)
        .then((response) => response.json())
        .then(data => {
            if (data.can_start === false)
            {
                setTimeout(queryEnd, 2000)
            }
            else {
                props.setSession(prev => {
                    return {...prev,
                        isActive: false
                    } 
                })
            }
        })
    }
    queryEnd()

    return (
        <Fragment>
            <Header />
            <div className="mt-[160px]">
                <div className="w-full aspect-square max-w-[400px] rounded-full bg-orange flex justify-center items-center relative mx-auto">
                    <h1 className="font-serif text-xl mb-3 ml-5">
                        Wait for the results...
                    </h1>
                </div>
                <div className="relative top-[-100px]">
                    <div className="w-[50%] float-right">
                        <p className="max-w-[80%]">Your mates are still guessing</p>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default WaitingEnd;