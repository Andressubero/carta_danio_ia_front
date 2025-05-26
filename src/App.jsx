import './App.css'
import Home from './components/Home/Home'
import { Routes, Route } from 'react-router-dom'
import UserRegister from './components/UserRegister/UserRegister'
import UserLogin from './components/UserLogin/UserLogin'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<UserRegister/>} />
        <Route path="/login" element={<UserLogin/>} />
      </Routes>
  )
}

export default App
