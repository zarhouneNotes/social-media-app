import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import { BrowserRouter , Routes , Route } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import UpdateProfile from './components/UpdateProfile';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />}  />
          <Route path='/signup' element={<Signup />}    />
          <Route path='/*' element={<PrivateRoute><Home /></PrivateRoute>} />
          
         
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
