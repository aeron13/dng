const WaitingWord = props => {

    // send a request every 2 seconds to see if all the words were sent
    const queryStatus = () => {

        fetch("query-words/" + props.session.player_id)
        .then((response) => response.json())
        .then(data => {
            if (data.can_start === false ) {
                setTimeout(queryStatus, 2000)
            }
            else {
                // if the game is ready, begin the first turn
                props.setSession( prev => {
                    return {
                        ...prev,
                        words: data.words,
                        // first_word: String(data.first_word),
                        turn: 1
                    }
                })
            }
        })
    }
    queryStatus()

    return (
        <div className="mt-[200px] mx-5">
            <p className="font-mono text-mid max-w-[350px]">waiting for everyone to send the word...</p>
        </div>
    )
}

export default WaitingWord;