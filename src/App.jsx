import { Navigate } from "react-router-dom";
import { useUser } from "./context/useUser"; 
import Onboarding from './components/Home/Onboarding'
import { Routes, Route } from 'react-router-dom'
import UserRegister from './components/UserRegister/UserRegister'
import EditPassword from './components/EditPassword/EditPassword'
import UserLogin from './components/UserLogin/UserLogin'
import VehicleStateTable from './components/Home/VehicleStateTable/VechicleStateTable'
import CreateVehicle from './components/CreateVehicle/CreateVehicle'
import MyVehicles from './components/MyVehicles/MyVehicles'
import VehicleDetail from './components/VehicleDetail/VehicleDetail'
import VehicleStateForm from './components/VehiclestateForm/VehiclestateForm'
import MainLayout from './components/Shared/MainLayout'
import './App.css'
import EditVehicle from "./components/EditVehicle/EditVehicle";

function App() {
  const { user, loading } = useUser();
function PrivateRoute({ children }) {
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

  if (loading) {
    return <h1>Cargando</h1>
  }
  return (
    <Routes>
      {/* Rutas protegidas */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<VehicleStateTable />} />
        <Route path="/vehicle-state/create/:id" element={<VehicleStateForm />} />
        <Route path="/createVehicle" element={<CreateVehicle />} />
        <Route path="/myVehicles" element={<MyVehicles />} />
        <Route path="/vehicle/:id" element={<VehicleDetail />} />
        <Route path="/vehicle/edit/:id" element={<EditVehicle />} />
        <Route path="/user/edit-password" element={<EditPassword />} />
      </Route>

      {/* Rutas públicas */}
      <Route
        path="/"
        element={user ? <Navigate to="/home" replace /> : <Onboarding />}
      />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />
    </Routes>
  );

}

export default App
