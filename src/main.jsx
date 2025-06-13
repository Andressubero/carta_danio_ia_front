import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './context/UserProvider';



ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <UserProvider>
    <App />
   </UserProvider>
  </BrowserRouter>
);
