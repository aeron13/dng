import { useRef, useEffect } from 'react'

const formatTime = (seconds) => {
    let date = new Date(0)
    date.setSeconds(seconds); 
    return date.toISOString().substring(14, 19);
}

const Timer = props => {

    const timerRef = useRef()
    let currentTime = 0

    useEffect( () => {
        if (props.maxTime > 0) {
            let timerInterval = setInterval(() => {
                if(currentTime < props.maxTime && props.isActive && timerRef.current) {
                    currentTime++
                    timerRef.current.innerText = formatTime(currentTime)
    
                } else if (currentTime === props.maxTime) {
                    clearInterval(timerInterval)
                    props.timerEndCallback()
                } else if (timerRef.current === null) {
                    clearInterval(timerInterval)
                }
            }, 1000)
        }
    }, [props.maxTime, props.isActive])
    
    return (
        <div className='timer'>
            <span className='font-bold' ref={timerRef}>{formatTime(currentTime)}</span> /
            <span> {formatTime(props.maxTime)}</span>
        </div>
    )

}

export default Timer;