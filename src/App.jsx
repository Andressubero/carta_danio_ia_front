import './App.css'
import Onboarding from './components/Home/Onboarding'
import { Routes, Route } from 'react-router-dom'
import UserRegister from './components/UserRegister/UserRegister'
import UserLogin from './components/UserLogin/UserLogin'
import VehicleStateTable from './components/Home/VehicleStateTable/VechicleStateTable'
import CreateVehicle from './components/CreateVehicle/CreateVehicle'
import MyVehicles from './components/MyVehicles/MyVehicles'
import VehicleDetail from './components/VehicleDetail/VehicleDetail'
import VehicleStateForm from './components/VehiclestateForm/VehiclestateForm'
import MainLayout from './components/Shared/MainLayout'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        <Route path="/home" element={<VehicleStateTable />} />
        <Route path="/vehiclestate/create" element={<VehicleStateForm />} />
        <Route path="/createVehicle" element={<CreateVehicle />} />
        <Route path="/myVehicles" element={<MyVehicles />} />
        <Route path="/vehicle/:id" element={<VehicleDetail />} />
      </Route>

      {/* Login y register sin Header/Footer */}
      <Route path="/" element={<Onboarding />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />

    </Routes>

  )
}

export default App
