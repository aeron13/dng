import { Fragment } from "react";

const MasterWaiting = props => {
    return (
        <Fragment>
            <div className="absolute h-[70%] w-screen bottom-0 bg-green opacity-40 rounded-t-full z-[-1]"></div>
            <div className="mt-[126px] flex flex-col mx-5">
                <p className="mb-3">This is the session code:</p>
                <h1 className="font-serif text-xl bg-green px-5 pt-1">{props.code}</h1>
                <p className="font-mono text-mid mt-3">Share it with all the players!</p>
            </div>
        </Fragment>
    ) 
}

export default MasterWaiting;