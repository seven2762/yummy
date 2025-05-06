import Logo from "./Logo";
import Nav from "./Nav";
import '../../styles/header.css'

export default function Header(){

  return(
      <>
      <header className=" ">

          <div className="hd ">
            <div className="center">
            <Logo />
              <Nav />
            </div>
          </div>


      </header>
      </>
  )

}