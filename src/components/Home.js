
import Notes from "./Notes";

export default function Home(props) {
    const {showAlert} = props
  return (
       <div>
           <Notes showAlert={showAlert}/>
       </div>
  )
}
