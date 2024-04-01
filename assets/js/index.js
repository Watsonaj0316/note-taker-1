// Save the note to the db
const saveNote = async (note) => {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
  
    if (!response.ok) {
      throw new Error('Failed to save note');
    }
  
    return response.json();
  };
  
  // Delete the note from the db
  const deleteNote = async (id) => {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
  
    return response.json();
  };
  
  // Get all notes from the db
  const getNotes = async () => {
    const response = await fetch('/api/notes');
  
    if (!response.ok) {
      throw new Error('Failed to get notes');
    }
  
    return response.json();
  };
  
  // Elements for rendering notes
  const noteTitle = document.querySelector('.note-title');
  const noteText = document.querySelector('.note-textarea');
  const saveNoteBtn = document.querySelector('#save-note');
  const newNoteBtn = document.querySelector('#new-note');
  const clearBtn = document.querySelector('#clear-note');
  const noteList = document.querySelectorAll('.list-container .list-group');
  
  // Active note object
  let activeNote = {};
  
  // Display active note
  const renderActiveNote = () => {
    if (!activeNote.id) {
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = '';
      noteText.value = '';
    } else {
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
    }
  };
  
  // Hide an element
  const hide = (el) => {
    if (el) {
      el.style.display = 'none';
    }
  };
  
  // Show an element
  const show = (el) => {
    if (el) {
      el.style.display = 'block';
    }
  };
  
  // Hide or show the clear button based on note input
  const handleRenderBtns = () => {
    // If there is no note title or text, hide the clear button
    if (!noteTitle.value.trim() && !noteText.value.trim()) {
      hide(clearBtn);
    } else {
      show(clearBtn);
    }
  
    // If there is no note title or text, hide the save button
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
      hide(saveNoteBtn);
    } else {
      show(saveNoteBtn);
    }
  };
  
  // Save the note to the db and refresh the note list
  const handleNoteSave = () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value,
    };
  
    saveNote(newNote).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };
  
  // Delete the clicked note and refresh the note list
  const handleNoteDelete = (e) => {
    // Prevents the click listener for the list from being called when the button inside of it is clicked
    e.stopPropagation();
  
    const note = e.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;
  
    if (activeNote.id === noteId) {
      activeNote = {};
    }
  
    deleteNote(noteId).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };
  
  // Sets the activeNote and displays it
  const handleNoteView = (e) => {
    e.preventDefault();
    activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    renderActiveNote();
  };
  
  // Sets the activeNote to and empty object and allows the user to