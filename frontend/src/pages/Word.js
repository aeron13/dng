import WriteWordForm from "../components/forms/WriteWordForm";
import WaitingWord from "../components/waiting/WaitingWord";
import Header from "../components/UI/Header";
import { Fragment, useState } from "react";

const Word = props => {

    const [phase, setPhase] = useState('write-word')

    return (
        <Fragment>
            <Header />    
            <div className="triangle absolute z-[-1] h-[75%] w-[80%] md:w-[50%]  bottom-0"></div>
            {  (phase === 'write-word' && 
                <WriteWordForm session={props.session} setPhase={setPhase} setSession={props.setSession} />)
            || (phase === 'waiting-word' &&
                <WaitingWord session={props.session} setSession={props.setSession} />) 
            }
        </Fragment>
    )
}

export default Word;