import { useContext } from "react";
import NoteCard from "./NoteCard";
import { useNavigate } from "react-router-dom";
import { NotesContext } from "./App";

function randomIdGenerator() {
  return Math.random().toString();
}

//created here for reference and if needed in any other src file later.
const Note = (title, content, last_modified_time) => {
    return {
      "title": title,
      "content": content,
      "last_modified_time": last_modified_time,
    };
  };

const NotesList = () => {
  const [notesMap, setNotesMap] = useContext(NotesContext);
  const note_display_list = notesMap.map((note) => (
    <NoteCard key={note.id} id={note.id} />
  ));
    const navigator = useNavigate();
    function newNote(){

        let new_id = randomIdGenerator();
        let id_already_exists = notesMap.has(new_id);
        console.log(new_id,id_already_exists);
        while(id_already_exists){
            new_id = randomIdGenerator();
        }
        let current_note = Note("", "", Date.now());
        const tempMap = new Map([...notesMap]);
        tempMap.set(new_id,current_note);
        setNotesMap(tempMap);
        navigator(`/note/${new_id}`);
    }

  return (
    <div className="Notes-list">
        <button onClick={newNote}>New Note</button>
      {note_display_list}
    </div>
  );
};

export default NotesList;
