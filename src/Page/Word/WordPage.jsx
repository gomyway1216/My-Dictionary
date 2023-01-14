import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../../Firebase/word';
import { Button, Box, CircularProgress } from '@mui/material';
import DeleteDialog from '../../Component/Dialog/DeleteDialog';
import InstantMessage from '../../Component/Alert/Alert';
import DOMPurify from 'dompurify';
import styles from './word-page.module.scss';

const WordPage = () => {
  let { id } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [word, setWord] = useState();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [apiError, setApiError] = useState(null);

  const getWord = async () => {
    setLoading(true);
    const response = await api.getWord(id);
    setWord(response);
    setLoading(false);
  };

  useEffect(() => {
    getWord();
  }, []);

  const handleEditClick = () => {
    navigate('/edit-word/' + id);
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

  const handleAlertClose = () => {
    setApiError('');
  };

  if(loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        <Button className={styles.editButton} 
          variant="outlined" onClick={handleEditClick}>Edit</Button>
        <Button className={styles.removeButton} 
          variant="outlined" color="error" 
          onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
      </div>
      <div className={styles.title}>{word.title}</div>
      <div dangerouslySetInnerHTML=
        {{__html: DOMPurify.sanitize(word.body)}} />
      <DeleteDialog open={deleteDialogOpen} 
        onClose={handleDeleteDialogClose} callback={handleDelete} />
      {apiError && <InstantMessage message={apiError} 
        onClose={handleAlertClose}/>}
    </div>
  );
};

export default WordPage;