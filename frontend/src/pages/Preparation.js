import { Fragment } from "react";
import CreateSessionForm from "../components/forms/CreateSessionForm";
import JoinSessionForm from "../components/forms/JoinSessionForm";
import Header from "../components/UI/Header";

const Preparation = props => {

    const clickBackHandler = () => {
      props.setIsIntro(true)
    }

    return (
      <Fragment>
        <Header />    
        <div className="mb-[168px]">
          <div className="bg-green opacity-40 absolute w-full h-[560px] top-0 z-[-1] rounded-b-[66vh]"></div>
          <div className="mx-5 mt-[116px] relative">
            <CreateSessionForm session={props.session} setSession={props.setSession} /> 
          </div>
        </div>
        <div className="">
          <div className="relative w-screen h-fit">
            <div className="bg-purple opacity-40 w-[104%] left-[-2%]-sm center-x h-full z-[-1] rounded-full absolute max-w-[1020px]"></div>
            <div className="pt-[67px] pb-[70px] mx-5">
              <JoinSessionForm session={props.session} setSession={props.setSession} />
            </div>
          </div>
          <div className="mx-5">
            <button className="button-sm mt-[66px] mb-[78px]" onClick={clickBackHandler}>back</button>
          </div>
        </div>
      </Fragment>
    )

}

export default Preparation;