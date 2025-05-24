import './App.css'
import Home from './components/Home/Home'
import { Routes, Route } from 'react-router-dom'
import UserRegister from './components/UserRegister/UserRegister'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<UserRegister/>} />
      </Routes>
  )
}

export default App
