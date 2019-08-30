import React from 'react';
import config from '../config';
import ApiContext from '../ApiContext';
import ValidationError from '../ValidationError';
import './AddNote.css'
const shotrid = require('shortid')

export default class AddNote extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      noteName: {
        value:"",
        touched:false
      },
      noteContent: {
        value:"",
        touched:false
      },
      wholeNote:{
        name:"",
        content:"",
        id:"",
        modified:"",
        folderId:"",
      }
    }
    
  }

  static defaultProps = {
    history:{
      goBack: () => { }
    },
    match:{
      params: {}
    }
  }
  static contextType = ApiContext;
  
  updateNoteName (name){
    this.setState( 
      {
        noteName: {value:name, touched:true}, 
        //wholeNote: {name:name}
    })
  }

  updateNoteContent(content){
    this.setState( 
      {
        noteContent: {value:content, touched:true},
        
    })
  }

  // *** Need to add folder and note ids*/

  validateNoteName(){
    const noteName = this.state.noteName.value.trim();
    if(noteName.length === 0){
      return "Note name is required"
    }
  }

  validateNoteContent(){
    const noteContent = this.state.noteContent.value.trim();
    if(noteContent.length === 0){
      return "Note content is required"
    }
  }

  updateServerNotes = note =>{
    
    fetch(`${config.API_ENDPOINT}/notes`, {
        method:'post',
        headers:{
            'content-type':'application/json',
        },
        body: JSON.stringify({
          name: note.name,
          id:note.id,
          content:note.content,
          modified:note.modified,
          folderId:note.folderId
        })
    })
    .then((folderRes)=>{
      
        if (!folderRes.ok)
          return folderRes.json().then(e=> Promise.reject(e))
        return folderRes.json()
    })
    .then((folderRes1)=>{
        
        alert(`A new note has been added`)
        this.props.history.goBack()
    })
    .catch(e =>{
      alert('something went wrong')
        console.error({e});
    })
  };

  getDateModified = () =>{
    var dateTime = new Date();
    return dateTime
  };
  

  addID = (newID) =>{
    newID = shotrid.generate()
    return newID
  };
  
  updateWholeNote (name, id, date, content, folderId){
    return this.setState({
      wholeNote:{
        name:name,
        content:content,
        id:id,
        modified:date,
        folderId:folderId
      }
    })
    
  }

  handleSubmit = e =>{
    e.preventDefault();
    
    const promise1 = new Promise((resolve, reject) =>{
    let modDate = this.getDateModified();
    let addedID = this.addID();
    let newName = this.state.noteName.value;
    let newContent = this.state.noteContent.value;
    let  {folderId}  = this.props.match.params;
    console.log(`here are the match params ${this.props.match.params}`)
    this.setState({
      wholeNote: ({ name:newName, content:newContent, id:addedID, modified:modDate, folderId:folderId})
    })
    resolve();
    })

    promise1.then(() =>{
      alert('note created')
      
      console.log(this.state.wholeNote)

      this.updateServerNotes(this.state.wholeNote)
      this.context.handleNoteSubmit(this.state.wholeNote)
    })
   
    
  };

  render(){

    const noteNameError = this.validateNoteName();

    const noteContentError = this.validateNoteContent();

    const { folderId } = this.props.match.params
    
    return(
      <div className = 'AddNote'>
        <div className= 'AddNote__container'>
        <h2 className = 'AddNote__title'>
          Please enter all details below to add a note
        </h2>
          <form className="addNote-form" onSubmit = {this.handleSubmit}>
            <div className="form-group">
              <div className="note_name">
                {/* <label htmlFor="name" className="lbl">Note Name</label> */}
                <input 
                  type='text'
                  className='form_input'
                  name = 'noteName'
                  id = 'noteName'
                  placeholder="Note Name"
                  onChange = {e=>this.updateNoteName(e.target.value)}
                /> {this.state.noteName.touched && <ValidationError message={noteNameError}/>}
              </div>
              <div className="note_content">  
                {/* <label htmlFor="content" className="lbl">Enter the content of your note here</label> */}
                <textarea 
                  rows="20" 
                  cols="40" 
                  placeholder="Enter Note Here"
                  onChange = {e=>this.updateNoteContent(e.target.value)}
                />
                {this.state.noteContent.touched && <ValidationError message={noteContentError}/>}
              </div>
            </div>
            <div className="btn-group">
              <button
                type="submit"
                className="submit-btn"
                disabled={this.validateNoteContent() || this.validateNoteContent()}
              >
                Submit
              </button> {/*need to check this*/}
              <button 
              type="button" 
              className="cancel"
              onClick={() =>this.props.history.goBack()}>Cancel</button>

            </div>

          </form>
        </div>
      </div>
    )
  }
}