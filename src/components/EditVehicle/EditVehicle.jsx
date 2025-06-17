import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../../styles/authLayout.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const validationSchema = Yup.object({
  vehicle_type_id: Yup.string().required("Tipo de vehiculo requerido"),
  brand: Yup.string().required("Marca requerida"),
  model: Yup.string().required("Modelo requerido"),
  year: Yup.string().required("Año requerido"),
  plate: Yup.string().min(6, "Mínimo 6 caracteres").max(7, "Máximo 7 caracteres").required("Patente requerida"),
});

const EditVehicle = () => {
  const [initialValues, setInitialValues] = useState(null);
  const [success, setSuccess] = useState();
  const [data, setData] = useState();
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL;

  useEffect(() => {
    const fetchVehicleData = async () => {
      const res = await fetch(`${apiUrl}/vehicle/${id}`, {
        credentials: "include",
      });
      setData(await res.json());
    };

    fetchVehicleData();
  }, [apiUrl, id]);

  useEffect(() => {
    if (data) {
      setInitialValues({
        vehicle_type_id: data.vehicle_type_id || "",
        brand: data.brand || "",
        model: data.model || "",
        year: data.year || "",
        plate: data.plate || "",
      });
    }
  }, [data]);

  const handleSubmit = async (values, actions) => {
    try {
      const response = await fetch(`${apiUrl}/vehicle/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const data = await response.json();
      setSuccess(data.success);
      setMessage(data.message);

      if (data.success) {
        navigate("/myVehicles");
      }
    } catch (error) {
      setSuccess(false);
      setMessage(error.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  if (!initialValues) return <p>Cargando datos del vehículo...</p>;

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="login-card text-center shadow">
        <h1>Editar vehículo</h1>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label">Marca:</label>
                <Field name="brand" type="text" className="form-control" />
                <ErrorMessage
                  name="brand"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Modelo:</label>
                <Field name="model" type="text" className="form-control" />
                <ErrorMessage
                  name="model"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Año:</label>
                <Field name="year" type="number" className="form-control" />
                <ErrorMessage
                  name="year"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Patente:</label>
                <Field name="plate" type="text" className="form-control" />
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
                Guardar Cambios
              </button>
            </Form>
          )}
        </Formik>

        {message && (
          <p style={{ color: success ? "green" : "red", marginTop: "1rem" }}>
            {message}
          </p>
        )}

        <div className={{ display: "flex", gap: "16px" }}>
          <a className="a-navegar" onClick={() => navigate("/myVehicles")}>
            Volver a mis vehículos
          </a>
        </div>
      </div>
    </div>
  );
};

export default EditVehicle;
