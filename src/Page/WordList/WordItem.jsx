import React from 'react';
import PropTypes from 'prop-types';
import { ListItemButton, ListItemAvatar } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClampLines from 'react-clamp-lines';
import { convert } from 'html-to-text';
import { useNavigate } from 'react-router-dom';
import styles from './word-item.module.scss';

const WordItem = (props) => {
  const { word } = props;
  const { id, body, needsEdit } = word;
  const bodyText = convert(body, {
    wordwrap: 280
  });
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate('/word/' + id);
  };

  return (
    <ListItemButton key={word.id} 
      onClick={handleItemClick}
      className={styles.item}>
      <ListItemAvatar>
        <Avatar>
          {needsEdit ? <EditIcon color="action"/> 
            : <CheckIcon color="primary"/>}
        </Avatar>
      </ListItemAvatar>
      <div className={styles.values}>
        <div className={styles.title}>{word.title}</div>
        <ClampLines
          text={bodyText}
          id="word-description-id"
          lines={1}
          buttons={false}
          ellipsis="..."
          className={styles.description}
        />
      </div>
    </ListItemButton>  
  );
};


WordItem.propTypes = {
  word: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    created: PropTypes.instanceOf(Date),
    lastUpdated: PropTypes.instanceOf(Date),
    needsEdit: PropTypes.bool.isRequired
  })
};


export default WordItem;