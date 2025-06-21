import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { ModalComponent } from "../Home/VehicleStateTable/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/authLayout.css';

const validationSchema = Yup.object({
  password: Yup.string()
    .required("Contraseña requerida")
    .min(8, "Mínimo 8 caracteres")
    .max(15, "Máximo 15 caracteres")
    .matches(/[A-Z]/, "Debe contener al menos una mayúscula")
    .matches(/[a-z]/, "Debe contener al menos una minúscula")
    .matches(/\d/, "Debe contener al menos un número")
    .matches(/[^\w\s]/, "Debe contener al menos un carácter especial"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
    .required("Confirmá tu contraseña"),
});

const PasswordRequirements = () => {
  const { values } = useFormikContext();
  const password = values.password || "";
  const checks = [
    { label: "Entre 8 y 15 caracteres", valid: password.length >= 8 && password.length <= 15 },
    { label: "Al menos una mayúscula", valid: /[A-Z]/.test(password) },
    { label: "Al menos una minúscula", valid: /[a-z]/.test(password) },
    { label: "Al menos un número", valid: /\d/.test(password) },
    { label: "Al menos un carácter especial", valid: /[^\w\s]/.test(password) },
  ];

  return (
    <ul className="list-unstyled mt-2">
      {checks.map((check, index) => (
        <li key={index} style={{ color: check.valid ? "green" : "gray" }}>
          {check.valid ? "✅" : "⬜"} {check.label}
        </li>
      ))}
    </ul>
  );
};

const EditPassword = () => {
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
    const [showModal, setModal] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (values, actions) => {
    try {
      const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL;
      const response = await fetch(`${apiUrl}/user/edit-password`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: values.password,
        }),
      });

      const data = await response.json();
      setSuccess(true);
      setMessage(data);

      if (data) {
        actions.resetForm();
        setModal(true)
      }
    } catch (error) {
      setSuccess(false);
      setMessage(error.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  function closeModal() {
    setModal(false);
    navigate('/home')
  }

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-card shadow">
        <h2 className="text-center mb-4">Editar contraseña</h2>

        <Formik
          initialValues={{ email: "", password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña:</label>
                <Field name="password" maxLength={15} type="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="text-danger mt-1" />
                <PasswordRequirements />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña:</label>
                <Field name="confirmPassword" type="password" maxLength={15} className="form-control" />
                <ErrorMessage name="confirmPassword" component="div" className="text-danger mt-1" />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={isSubmitting || !isValid}
              >
                Registrarse
              </button>
            </Form>
          )}
        </Formik>

        {message && (
          <div className={`alert mt-3 ${success ? "alert-success" : "alert-danger"}`} role="alert">
            {message}
          </div>
        )}

        <a className="a-navegar" onClick={() => navigate("/")}>
          Volver
        </a>
      </div>
      <ModalComponent isOpen={showModal} setIsOpen={closeModal}>
        <div className="p-5 gap-5 d-flex flex-column justify-content-center">
          <h5 className="text-center">Password Actualizada correctamente</h5>
          <button onClick={closeModal} className="btn btn-outline-primary">Aceptar</button>
        </div>
      </ModalComponent>
    </div>
  );
};

export default EditPassword;
