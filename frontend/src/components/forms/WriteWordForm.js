import { Fragment, useState } from "react"
import { PostRequestData } from "../../helpers/postRequestCSRF"


const WriteWordForm = (props) => {

    const [error, setError] = useState('')

    const sumbitHandler = event => {
  
        event.preventDefault()
        setError('')

        let word = event.target.querySelector("#word").value.trim()
        if (!word) setError('Enter a word.')

        else {
            fetch('save-word/' + props.session.player_id, {
                ...PostRequestData(),
                body: JSON.stringify({
                    'session_code': props.session.code,
                    'word': word.toLowerCase()
                })
            })
            .then((response) => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error)
                }
                else {
                    props.setSession( prev => {
                        return {
                            ...prev,
                            player_word: word
                        }
                    })
                    props.setPhase('waiting-word')
                }
            })
        }
    
    }

    return (
        <Fragment>
            <form id="word-form" action="word" method="post" onSubmit={sumbitHandler} className="mx-5 mt-[168px]">
                { error && <p className="font-bold">{error}</p>}
                <div className="form-el">
                    <label htmlFor="word">Choose a word</label>
                    <input id="word" type="text" name="word" className="border border-dark p-2" />
                    <p className="mt-1">Type an object or concept everybody knows.</p>
                </div>
                <input type="submit" value="Save word" className="button bg-dark w-fit" /> 
            </form>
        </Fragment>
    )
}

export default WriteWordForm;