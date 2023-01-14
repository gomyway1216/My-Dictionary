import React, { useEffect, useState, useRef } from 'react';
import * as api from '../../Firebase/word';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import styles from './word-editor-page.module.scss';
import { Button, FormGroup, FormControlLabel, TextField, 
  Switch } from '@mui/material';
import InstantMessage from '../../Component/Alert/Alert';
import DeleteDialog from '../../Component/Dialog/DeleteDialog';


const WordEditorPage = () => {
  const [original, setOriginal] = useState({});
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isPublic, setPublic] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [needsEdit, setNeedsEdit] = useState(true);
  const [counter, setCounter] = useState(0);
  const [intervalId, setIntervalId] = useState();
  const navigate = useNavigate();
  const { id } = useParams();
  const updateInterval = 10000;
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [apiError, setApiError] = useState(null);

  const intervalIdRef = useRef(intervalId);
  intervalIdRef.current = intervalId;

  const countRef = useRef(counter);
  countRef.current = counter;

  const titleRef = useRef(title);
  titleRef.current = title;
  const bodyRef = useRef(body);
  bodyRef.current = body;
  const isPublicRef = useRef(isPublic);
  isPublicRef.current = isPublic;
  const needsEditRef = useRef(needsEdit);
  needsEditRef.current = needsEdit;

  const getDoc = async () => {
    const doc = await api.getWord(id);
    if(doc) {
      setTitle(doc.title);
      setBody(doc.body);
      setPublic(doc.isPublic);
      setOriginal({
        id,
        title: doc.title,
        body: doc.body,
        isPublic: doc.isPublic,
        lastUpdated: new Date(doc.lastUpdated.seconds * 1000),
        needsEdit: doc.needsEdit
      });
    } else {
      navigate('/word');
    }
  };

  useEffect(() => {
    getDoc();
  }, []);
  
  useEffect(() => {
    if(autoSave) {
      const interval = setInterval(() => {
        // The logic of changing counter value to come soon.
        let currCount = countRef.current;
        setCounter(currCount => currCount + 1);
        const item = {
          id,
          title: titleRef.current, 
          body: bodyRef.current, 
          isPublic: isPublicRef.current,
          needsEdit: needsEditRef.current
        };

        try {
          api.updateWord(item);
        } catch (err) {
          setApiError('Auto save is failing!');
        }
        
      }, updateInterval);
      setIntervalId(interval);

      // triggered when component unmounts
      return () => {
        clearInterval(intervalIdRef.current);
      };
    } else {
      clearInterval(intervalId);
    }
  }, [autoSave]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const onAutoSaveSwitchChange = (e) => {
    setAutoSave(e.target.checked);
  };

  const handleNeedsEditSwitchChange = (e) => {
    setNeedsEdit(e.target.checked);
  };

  const handleSave = () => {
    const item = {
      id,
      title: title, 
      body: body, 
      isPublic: isPublic,
      needsEdit: needsEdit
    };
    try {
      api.updateWord(item);
      navigate('/word');
    } catch (error) {
      setApiError(error.message);
    }
  };

  const handleClose = () => {
    try {
      api.updateWord(original);
      navigate('/word');
    } catch (error) {
      setApiError(error.message);
    }
  };

  const handleAlertClose = () => {
    setApiError('');
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    try {
      await api.deleteWord(id);
      navigate('/word');
    } catch (error) {
      setApiError(error.message);
    }
  };
  
  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <TextField id="outlined-basic" label="Title" variant="outlined" 
          value={title} fullWidth onChange={handleTitleChange}/>
      </div>
      <FormGroup className={styles.autoSaveSwitch}>
        <FormControlLabel 
          control={
            <Switch    
              checked={needsEdit}
              onChange={handleNeedsEditSwitchChange}
            />
          } 
          label="Needs edit" />
      </FormGroup>
      <FormGroup className={styles.autoSaveSwitch}>
        <FormControlLabel 
          control={
            <Switch    
              checked={autoSave}
              onChange={onAutoSaveSwitchChange}
            />
          } 
          label="Auto Save" />
      </FormGroup>

      <div className={styles.toolBar}>
        <EditorToolbar/>
      </div>
      <ReactQuill 
        theme="snow"
        modules={modules} 
        formats={formats} 
        placeholder={'Write something awesome...'}
        value={body} 
        onChange={setBody} />
      <div className={styles.buttons}>
        <Button variant="outlined" onClick={handleSave} 
          className={styles.button}>Save and Close</Button>
        <Button variant="outlined" color="error" onClick={handleClose} 
          className={styles.button}>Close without Saving</Button>
        <Button variant="outlined" color="error" 
          onClick={() => setDeleteDialogOpen(true)} 
          className={styles.button}>Delete</Button>
      </div>
      <DeleteDialog open={deleteDialogOpen} 
        onClose={handleDeleteDialogClose} callback={handleDelete} />
      {apiError && <InstantMessage message={apiError} 
        onClose={handleAlertClose}/>}
    </div>
  );
};

export default WordEditorPage;