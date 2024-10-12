import { Fragment } from 'react'

const Intro = (props) => {

    const clickHandler = () => {
        props.setIsIntro(false)
    }

    return (
        <Fragment>
            <div className='fixed w-screen h-screen z-[-1] flex items-start justify-center top-[430px]'>
                <div className='h-[70vw] min-h-[70vh] w-[100%] rounded-t-[100%] bg-green opacity-40 max-w-[1280px]'></div>
            </div>
            <div className="flex flex-col items-center h-screen pt-[107px] mx-5">
                <h1 className="text-center mt-5 font-impact text-xl">DnG</h1>
                <h2 className="font-mono text-mid text-center">draw and guess with <br /> your friends</h2>
                <button className="button-xl bg-green mt-[71px]" onClick={clickHandler}>
                    Play now
                </button>
            </div>
        </Fragment>
    )
}

export default Intro;