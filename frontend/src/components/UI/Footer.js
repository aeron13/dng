const Footer = props => {
    return (
        <footer className="fixed bottom-0 px-1 pb-7 w-full">
            <div className="flex justify-between mx-5 opacity-40">
                <p>Session: {props.session_code ? props.session_code : '123456'}</p>
                <p className="text-right">Player: {props.name ? props.name : 'Paul' }</p>
            </div>
        </footer>
    )
}

export default Footer;