import { Fragment, useEffect, useState} from 'react'

import Intro from './pages/Intro';
import Preparation from './pages/Preparation';
import Waiting from './pages/Waiting';
import Game from './pages/Game';
import Word from './pages/Word';
import EndGameView from './pages/EndGameView';
import Footer from './components/UI/Footer';

const sessionObject = {
  code: 0, 
  isActive: false, 
  isMaster: false, 
  n_players: 0,
  player_id: '',
  player_name: '',
  turn: 0,
  player_word: '',
  words: [],
  first_word: '',
  score: 0,
  winner: false,
}

function App() {

  const [session, setSession] = useState(sessionObject)
  const [isIntro, setIsIntro] = useState(true)

  const preparationView = session.code === 0 && !isIntro
  const waitingView = session.code !== 0 && !session.isActive && session.turn === 0 && !isIntro
  const wordView =  session.code !== 0 && session.isActive && session.turn === 0 && !isIntro
  const gameActiveView =  session.code !== 0 && session.isActive && session.turn !== 0 && !isIntro
  const gameEnd = session.code !== 0 && !session.isActive && session.turn !== 0 && !isIntro


  // send a notification to the server when the user abandons the game
  useEffect(() => {

    const handleQuitSession = async () => {
      // if the user has entered the game, send a notification
      // and delete the player
      if (session.player_id) {
        await fetch('quit-session/' + session.player_id)
      }
    }

    if (session.player_id) {
      window.addEventListener('beforeunload', alertUser)
      window.addEventListener('unload', handleQuitSession)
    }

    return () => {
      window.removeEventListener('beforeunload', alertUser)
      window.removeEventListener('unload', handleQuitSession)
      handleQuitSession()
    }
  }, [session.player_id])


  // display a confirmation message when the user abandons the game
  const alertUser = e => {
      var confirmationMessage = "Do you want to abandon the game?";
      (e || window.event).returnValue = confirmationMessage; 
      return confirmationMessage;  
  }

  return (
    <div className="App">
      {isIntro ? <Intro setIsIntro={setIsIntro} /> 
      : <Fragment>
          { preparationView && <Preparation session={session} setSession={setSession} setIsIntro={setIsIntro} /> }
          { waitingView && <Waiting session={session} setSession={setSession} /> }
          { wordView && <Word session={session} setSession={setSession} /> }
          { gameActiveView && <Game session={session} setSession={setSession} /> }
          { gameEnd && <EndGameView session={session} setSession={setSession} /> }
          { session.code !== 0 &&
           <Footer session_code={session.code} name={session.player_name} /> }
        </Fragment>}
    </div>
  );
}

export default App;

