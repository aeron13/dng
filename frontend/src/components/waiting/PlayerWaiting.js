const PlayerWaiting = () => {
    return <div className="w-full mt-[50px]">
        <div className="w-[102%] aspect-square rounded-full bg-purple opacity-50 absolute z-[-1] max-w-[600px] center-x"></div>
        <div className="flex flex-col justify-center w-full aspect-square px-8 max-w-[600px] mx-auto">
            <h1 className="font-serif text-xl">Joined!</h1>
            <p className="mt-2 font-mono text-mid max-w-[270px]">waiting for everyone else to join.  </p>
        </div>
    </div>
}

export default PlayerWaiting;