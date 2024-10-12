import { Fragment } from "react";
import MasterWaiting from "../components/waiting/MasterWaiting";
import PlayerWaiting from "../components/waiting/PlayerWaiting";
import Header from "../components/UI/Header";

const Waiting = (props) => {

    // send a request every 2 seconds to see if the session started
    const queryStatus = () => {

        fetch("active-players/" + props.session.code)
        .then((response) => response.json())
        .then(data => {
            if (!data.is_active) {
                setTimeout(queryStatus, 2000)
            }
            else {
                // if the session started, set it to active
                props.setSession( prev => {
                    return {...prev, isActive: true}
                })
            }
        })
    }
    queryStatus()

    return (
        <Fragment>
            <Header />    
            { props.session.isMaster
                ? <MasterWaiting code={props.session.code} />
                : <PlayerWaiting />
            }
        </Fragment>
    ) 
}

export default Waiting;