import React, { useEffect, useState } from 'react';
import { Button, Box, CircularProgress, List, } from '@mui/material';
import {useNavigate } from 'react-router-dom';
import * as api from '../../Firebase/word';
import WordItem from './WordItem';
import InstantMessage from '../../Component/Alert/Alert';
import styles from './word-list-page.module.scss';

const WordListPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [wordList, setWordList] = useState([]);
  const [apiError, setApiError] = useState(null);

  const getWordList = async () => {
    setLoading(true);
    const words = await api.getWords();
    setWordList(words);
    setLoading(false);
  };

  useEffect(() => {
    getWordList();
  }, []);

  const handleAddWord = async () => {
    // crete the word and get id for the it 
    // so that word edit page can do auto saving with the id
    try {
      const docId = await api.addWord();
      navigate('/edit-word/' + docId);
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
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {wordList.map(word => <WordItem key={word.id} word={word} />)}
      </List>
      <div>
        <Button variant="outlined" onClick={handleAddWord}>Add Word</Button>
      </div>
      {apiError && <InstantMessage message={apiError} 
        onClose={handleAlertClose}/>}
    </div>
  );
};

export default WordListPage;