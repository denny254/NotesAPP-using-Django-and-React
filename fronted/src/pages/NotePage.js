import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ReactComponent as Arrowleft } from '../assets/arrow-left.svg';
import { useParams, useNavigate } from 'react-router-dom';

const NotePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const textareaRef = useRef(null);

    const createNote = useCallback(async () => {
        if (id === 'new') {
            setNote({ body: '' });
        } else {
            try {
                const response = await fetch(`/api/notes/${id}/`); 
                if (response.ok) {
                    const data = await response.json();
                    setNote(data);
                } else {
                    console.error('Failed to fetch the note');
                }
            } catch (error) {
                console.error('An error occurred while fetching the note:', error);
            }
        }
    }, [id]);

    useEffect(() => {
        createNote();
    }, [createNote]);

    const handleTextareaChange = (event) => {
        const updatedNote = { ...note, body: event.target.value };
        setNote(updatedNote);
    };

    const handleSubmit = () => {
        if (id !== 'new' && !note.body) {
            deleteNote()
        } else if (id !== 'new'){
            saveNote()
        } else if (id === 'new' && note === null){
            createNote()
        }
        navigate('/')
    }

    const saveNote = async () => {
        try {
            const method = id === 'new' ? 'POST' : 'PUT';
            const url = id === 'new' ? `/api/notes/` : `/api/notes/${id}`; 
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(note),
            });

            if (response.ok) {
                alert('Note saved successfully');
                navigate('/'); 
            } else {
                console.error('Failed to save the note');
            }
        } catch (error) {
            console.error('An error occurred while saving the note:', error);
        }
    };

    const deleteNote = async () => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                const response = await fetch(`/api/notes/${id}`,{
                    method: 'DELETE',
                }); 

                if (response.ok) {
                    alert('Note deleted successfully');
                    navigate('/'); 
                } else {
                    console.error('Failed to delete the note');
                }
            } catch (error) {
                console.error('An error occurred while deleting the note:', error);
            }
        }
    };

    return (
        <div className='note'>
            <div className='note-header'>
                <h3> 
                    <Arrowleft onClick={handleSubmit}/>
                </h3>
                <button onClick={saveNote}>Save</button>
                {id !== 'new' && <button onClick={deleteNote}>Delete</button>}
            </div>
            <textarea
                ref={textareaRef}
                value={note?.body}
                onChange={handleTextareaChange}
            ></textarea>
        </div>
    );
};

export default NotePage;
