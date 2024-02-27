import React,{useContext} from 'react'
import noteContext from '../contex/notes/noteContext'

const Noteitem = (props) => {
  const context = useContext(noteContext);
    const {deleteNote} = context;
  const { note , updateNote } = props;
  return (
    <div className= "col-md-3" >
      <div className="card my-3">
          <div className="card-body" style={{color:"black"}}>
            <h5 className="card-title"> {note.title}</h5>
            <p className="card-text">{note.description}</p>
            <div className="container d-flex justify-content-end">
            <i className="first fa-solid fa-trash mx-2" onClick={()=>{deleteNote(note._id);
                props.showAlert("Note deleted Successfully", "success")
              }}></i>
            <i className="second fa-regular fa-pen-to-square mx-2" onClick={()=>{updateNote(note)}}></i>
            </div>
            
          </div>
      </div>
    </div>
  )
}

export default Noteitem
