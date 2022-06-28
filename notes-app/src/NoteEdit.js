import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { NotesContext } from "./App";

const NoteEdit = () => {
  let { note_id } = useParams();
  const [notesMap, setNotesMap] = useContext(NotesContext);
  const [note, setNote] = useState(() => {
    let current_note = notesMap.get(note_id);
    console.log(current_note);
    return current_note;
  });
  return( 
    <div className="Note">
        {note.id}
    </div>
    );
};

export default NoteEdit;
