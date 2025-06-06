import './App.css'
import Home from './components/Home/Home'
import { Routes, Route } from 'react-router-dom'
import UserRegister from './components/UserRegister/UserRegister'
import UserLogin from './components/UserLogin/UserLogin'
import VehicleStateTable from './components/Home/VehicleStateTable/VechicleStateTable'
import CreateVehicle from './components/CreateVehicle/CreateVehicle'
import MyVehicles from './components/MyVehicles/MyVehicles'
import VehicleDetail from './components/VehicleDetail/VehicleDetail'
import DamageForm from './components/VehiclestateForm/VehiclestateForm'
import DamageEditor from './components/VehiclestateForm/DamageEditor'

function App() {
  return (
      /*<Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<UserRegister/>} />
        <Route path="/login" element={<UserLogin/>} />
        <Route path="/getall" element={<VehicleStateTable/>} />
        <Route path="/createVehicle" element={<CreateVehicle/>} />
        <Route path="/myVehicles" element={<MyVehicles/>}/>
        <Route path="/vehicle/:id" element={<VehicleDetail />} />
      </Routes>
      */
      <DamageForm/>
      //<DamageEditor/>
  )
}

export default App
