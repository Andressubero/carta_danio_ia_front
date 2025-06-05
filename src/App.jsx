import './App.css'
import Home from './components/Home/Home'
import { Routes, Route } from 'react-router-dom'
import UserRegister from './components/UserRegister/UserRegister'
import UserLogin from './components/UserLogin/UserLogin'
import VehicleStateTable from './components/Home/VehicleStateTable/VechicleStateTable'
import VehicleDetail from './components/VehicleDetail/VehicleDetail'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<UserRegister/>} />
        <Route path="/login" element={<UserLogin/>} />
        <Route path="/getall" element={<VehicleStateTable/>} />
        <Route path="/vehicle/:id" element={<VehicleDetail />} />
      </Routes>
  )
}

export default App
