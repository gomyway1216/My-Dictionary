import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import SignInPage from './Page/SignIn/SignInPage';
import WordPage from './Page/Word/WordPage';
import WordListPage from './Page/WordList/WordListPage';
import WordEditorPage from './Page/WordEditor/WordEditorPage';



const RouteList = () => {
  return (
    <div className="page-container">
      <Routes>
        <Route path='/signin' element={<SignInPage />} />
        <Route exact path='/' element={<PrivateRoute/>} >
          <Route exact path='/' element={<WordListPage/>} />
        </Route>
        <Route exact path='/word' element={<PrivateRoute/>}>
          <Route exact path='/word' element={<WordListPage/>}/>
        </Route>
        <Route exact path='/word/:id' element={<PrivateRoute/>}>
          <Route exact path='/word/:id' element={<WordPage/>}/>
        </Route>
        <Route exact path='/edit-word/:id' element={<PrivateRoute/>}>
          <Route exact path='/edit-word/:id' element={<WordEditorPage/>}/>
        </Route>
      </Routes>
    </div>
  );
};

export default RouteList;