import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../UserLogin/UserLogin.css";
import { useEffect, useState } from "react";

const validationSchema = Yup.object({
  vehicle_type_id: Yup.string().required("Nombre de usuario requerido"),
  brand: Yup.string().required("Marca requerida"),
  model: Yup.string().required("Modelo requerido"),
  year: Yup.string().required("Año requerido"),
  plate: Yup.string().required("Patente requerida"),
});

const CreateVehicle = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState("");
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
        console.log("Error de conexión con el servidor.");
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

      if (data.success) actions.resetForm();
    } catch (error) {
      setSuccess(false);
      setMessage("Error de conexión con el servidor");
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <>
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
            <label htmlFor="vehicle_type_id">Tipo de vehículo:</label>
            <Field as="select" name="vehicle_type_id" className="input-field">
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
              className="error-text"
            />
            <label htmlFor="brand">Marca:</label>
            <Field
              id="brand"
              name="brand"
              type="text"
              className="input-field"
            />
            <ErrorMessage name="brand" component="div" className="error-text" />

            <label htmlFor="model">Modelo:</label>
            <Field
              id="model"
              name="model"
              type="text"
              className="input-field"
            />
            <ErrorMessage name="model" component="div" className="error-text" />

            <label htmlFor="year">Año:</label>
            <Field
              id="year"
              name="year"
              type="number"
              className="input-field"
            />
            <ErrorMessage name="year" component="div" className="error-text" />

            <label htmlFor="plate">Patente:</label>
            <Field
              id="plate"
              name="plate"
              type="text"
              className="input-field"
            />
            <ErrorMessage name="plate" component="div" className="error-text" />

            <button
              type="submit"
              className="submit-button"
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
    </>
  );
};

export default CreateVehicle;
