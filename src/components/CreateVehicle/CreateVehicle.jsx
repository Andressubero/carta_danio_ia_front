import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../../styles/authLayout.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const validationSchema = Yup.object({
  vehicle_type_id: Yup.string().required("Tipo de vehiculo requerido"),
  brand: Yup.string().required("Marca requerida"),
  model: Yup.string().required("Modelo requerido"),
  year: Yup.string().required("Año requerido"),
  plate: Yup.string().min(6, "Mínimo 6 caracteres").max(7, "Máximo 7 caracteres").required("Patente requerida"),
});

const CreateVehicle = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL;

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const response = await fetch(`${apiUrl}/vehicle-type/findAll`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setVehicleTypes(data.vehicle_types);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchVehicleTypes();
  }, [apiUrl]);

  const handleSubmit = async (values, actions) => {
    try {
      const response = await fetch(`${apiUrl}/vehicle/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          vehicle_type_id: values.vehicle_type_id,
          brand: values.brand,
          model: values.model,
          year: values.year,
          plate: values.plate,
        }),
      });

      const data = await response.json();
      setSuccess(data.success);
      setMessage(data.message);

      if (data.success) 
      {
        actions.resetForm();
        navigate("/vehicle-state/create/" + data.vehicle.id ,{state: { from: "/createVehicle" }});
      }
    } catch (error) {
      setSuccess(false);
      setMessage(error.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="login-card text-center shadow">
        <h1>Agregá un nuevo vehiculo</h1>
        <Formik
          initialValues={{
            vehicle_type_id: "",
            brand: "",
            model: "",
            year: "",
            plate: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="vehicle_type_id" className="form-label">
                  Tipo de vehículo:
                </label>
                <Field
                  as="select"
                  name="vehicle_type_id"
                  className="form-control"
                >
                  <option value="" disabled hidden></option>
                  {vehicleTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="vehicle_type_id"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="brand" className="form-label">
                  Marca:
                </label>
                <Field
                  id="brand"
                  name="brand"
                  type="text"
                  className="form-control"
                />
                <ErrorMessage
                  name="brand"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="model" className="form-label">
                  Modelo:
                </label>
                <Field
                  id="model"
                  name="model"
                  type="text"
                  className="form-control"
                />
                <ErrorMessage
                  name="model"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="year" className="form-label">
                  Año:
                </label>
                <Field
                  id="year"
                  name="year"
                  type="number"
                  className="form-control"
                />
                <ErrorMessage
                  name="year"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="plate" className="form-label">
                  Patente:
                </label>
                <Field
                  id="plate"
                  name="plate"
                  type="text"
                  className="form-control"
                />
                <ErrorMessage
                  name="plate"
                  component="div"
                  className="text-danger"
                />
              </div>
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={isSubmitting}
              >
                Registrar Vehículo
              </button>
            </Form>
          )}
        </Formik>

        {message !== "" ? (
          <p style={{ color: success ? "green" : "red", marginTop: "1rem" }}>
            {message}
          </p>
        ) : (
          <></>
        )}
        <div className={{ display: 'flex', gap: '16px' }}>
          <a className="a-navegar" onClick={() => navigate("/home")}>
            Volver al menú
          </a>

          <a className="a-navegar" onClick={() => navigate("/myVehicles")}>
            Ir a Mis Vehículos
          </a>
        </div>
      </div>
    </div>
  );
};

export default CreateVehicle;
