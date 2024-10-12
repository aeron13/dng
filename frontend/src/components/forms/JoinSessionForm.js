import { useState } from "react"
import { PostRequestData } from "../../helpers/postRequestCSRF"

function JoinSessionForm(props) {

    const [error, setError] = useState('')

    const sumbitHandler = event => {
  
        event.preventDefault()
        setError('')

        let name = event.target.querySelector("#join-name").value.trim()
        let code = event.target.querySelector("#code").value

        if (!code) setError('Enter a code.')
        else if (!name) setError('Invalid name.')

        else {
            fetch('/join-session', {
                ...PostRequestData(),
                body: JSON.stringify({
                    'session_code': code,
                    'name': name.toLowerCase()
                })
            })
            .then((response) => response.json())
            .then(data => {
                if (data.session_code) {
                    console.log(data.player_id)
                    props.setSession( prev => {
                        return {...prev, 
                            code: data.session_code, 
                            n_players: data.number_of_players,
                            player_id: data.player_id,
                            player_name: data.player_name
                        }
                    })
                }
                else {
                    setError(data.error)
                }
            })
        }
    
    }


    return (
        <form id="join-session-form" action="join-session" method="post" onSubmit={sumbitHandler}>
            <h2 className="font-sans text-text w-full">Join a game.</h2>
            { error && <p className="font-bold">{error}</p>}
            <div className="form-el w-full">
                <label htmlFor="players">Paste here the session code</label>
                <input id="code" type="text" name="code" />
            </div>
            <div className="form-el w-full">
                <label htmlFor="name">Enter your name</label>
                <input id="join-name" type="text" name="name" />
            </div>  
            <input type="submit" value="Join session" className="button bg-purple w-fit"/> 
        </form>
    )
}

export default JoinSessionForm;