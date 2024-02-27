
import React,{useContext, useState} from 'react'
import noteContext from '../contex/notes/noteContext'


const AddNote = (props) => {
    const context = useContext(noteContext);
    const {addNote} = context;

    const [note , setNote] = useState({title:"" ,description:"",tag:""})

   const addClick = (e) =>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        setNote({title:"" ,description:"",tag:""})
        props.showAlert("Note added Successfully", "success")

    }
    const onChange = (e) =>{
      setNote({...note,[e.target.name]:e.target.value})
    }
  return (
    
    <div className='container my-3' style={{color:"white"}}>
      <h2>Add a Note</h2>
      <form className='my-3'>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" className="form-control" id="title" name='title' value={note.title} aria-describedby="emailHelp" onChange={onChange} minLength={3} required />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label" >Description</label>
          <input type="text" className="form-control" id="description" name='description' value={note.description} onChange={onChange} minLength={5} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label" >Tag</label>
          <input type="text" className="form-control" id="tag" name='tag' value={note.tag} onChange={onChange}/>
        </div>
        <button disabled = {note.title.length<3 || note.description.length<5} type="submit" className="btn btn-success btn-md" onClick={addClick}>Add</button>
      </form>
     
    </div>
  )
}

export default AddNote
