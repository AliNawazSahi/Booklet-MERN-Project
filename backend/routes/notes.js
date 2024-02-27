const express = require('express');
const router = express.Router();
const Note = require('../models/Note')
const Fetchuser = require('../middleware/Fetchuser')
const { body, validationResult } = require('express-validator');

// Route:1 Get All the Notes using : GET "/api/notes/fetchallnotes" . login required!!
router.get('/fetchallnotes', Fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }

})
// Route:2 Add a new Note using : POST "/api/notes/addnote" . login required!!
router.post('/addnote', Fetchuser, [
    //validation checks
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // If there are errors send bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save();
        res.json(saveNote)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }

})

// Route:3 Updating an existing Note using : PUT "/api/notes/updatenote" . login required!!
router.put('/updatenote/:id', Fetchuser, async (req,res)=>{
   try {
    const {title , description , tag} = req.body;
    //create a newNote object
    const newNote = {};
    if (title) { newNote.title = title}
    if (description) { newNote.description = description}
    if (tag) { newNote.tag = tag};

    //Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
        return res.status(404).send("Not Found")
    }
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Found")
    }
    note = await Note.findByIdAndUpdate(req.params.id,{$set : newNote} , {new : true});
    res.json(note);
} catch (error) {
    console.error(error.message);
        res.status(500).send("Internal Server Error occured");
}
} )
  

// Route:4 Deleting an existing Note using : DELETE "/api/notes/deletenote" . login required!!

router.delete('/deletenote/:id', Fetchuser, async (req,res)=>{
   try {
    const {title , description , tag} = req.body;
    

    //Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
        return res.status(404).send("Not Found")
    }
    // Allow user to delete it if owns it!!
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Found")
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({"Success": "Note has been Deleted successfully",note:note});
   } catch (error) {
    console.error(error.message);
        res.status(500).send("Internal Server Error occured");
   }
    
} )



module.exports = router;