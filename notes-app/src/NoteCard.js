import { useContext, useState } from "react";
import { NotesContext } from "./App";

const NoteCard = (props) => {
    const [notesMap, setNotesMap] = useContext(NotesContext);
    const [note, setNote] = useState(notesMap.get(props.id));
    
  return( 
    <div className="Note-card">
        <div className="Note-title">
            {note.id}
        </div>
        <div className="Note-content">

        </div>
        <div className="Modify-time">

        </div>
    </div>
);
};

export default NoteCard;
