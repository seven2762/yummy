import Logo from "./Logo";
import Nav from "./Nav";
import '../../styles/header.css'



export default function Header(){

  return(
      <>
      <header className="hd  w-100">
        <div className="center row-flex-center between">
          <Logo />
          <Nav />
        </div>
      </header>
      </>
  )

}