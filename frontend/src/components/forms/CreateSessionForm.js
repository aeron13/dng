import { useState } from "react"
import { PostRequestData } from "../../helpers/postRequestCSRF"

function CreateSessionForm(props) {

    const [error, setError] = useState('')

    const sumbitHandler = event => {
  
        event.preventDefault()

        let name = event.target.querySelector("#create-name").value.trim()
        let number_of_players = event.target.querySelector("#players").value

        if(!name) setError('Invalid name.')
        else if (!number_of_players) setError('Invalid number of players')

        else {
            fetch('/create-session', {
                ...PostRequestData(),
                body: JSON.stringify({
                    'number_of_players': number_of_players,
                    'name': name.toLowerCase()
                })
            })
            .then((response) => response.json())
            .then(data => {
                if (data.session_code) {
                    
                    props.setSession( prev => {
                        return {...prev,
                            code: data.session_code, 
                            isMaster: true, 
                            n_players: number_of_players,
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
        <form id="create-session-form" action="create-session" method="post" onSubmit={sumbitHandler} className="mt-[26px] items-center">
            <h2 className="font-sans text-text w-full">Create a new game.</h2>
            { error && <p className="font-bold">{error}</p>}
            <div className="form-el w-full">
                <label htmlFor="players" className="">How many people are playing?</label>
                <select id="players" name="number_of_players">
                    <option value="3">3</option>
                    <option value="5">5</option> 
                    <option value="7">7</option>
                    <option value="9">9</option>
                    <option value="11">11</option>  
                </select>
            </div>
            <div className="form-el w-full">
                <label htmlFor="name" className="mt-[26px]">Enter your name</label>
                <input id="create-name" type="text" name="name" />
            </div>
            <input type="submit" className="button-xl bg-green mt-10" value="create game session" /> 
        </form>
    )
}

export default CreateSessionForm;