import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./userRegister.css";
import { useEffect, useState } from "react";

const validationSchema = Yup.object({
  email: Yup.string().email("Email inválido").required("Email requerido"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Contraseña requerida"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
    .required("Confirmá tu contraseña"),
});

const UserRegister = () => {
  const [success, setSuccess] = useState()
  const [message, setMessage] = useState("")

  const handleSubmit = async (values, actions) => {
    try {
      const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL;
      const response = await fetch(`${apiUrl}/user/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.email,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();
      setSuccess(data.success)
      setMessage(data.message)

      if (data.success) actions.resetForm();
    } catch (error) {
      setSuccess(false);
      setMessage("Error de conexión con el servidor")
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <h1>Registrate</h1>
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <label>Email:</label>
            <Field name="email" type="email" className="input-field" />
            <ErrorMessage name="email" component="div" className="error-text" />

            <label>Contraseña:</label>
            <Field name="password" type="password" className="input-field" />
            <ErrorMessage
              name="password"
              component="div"
              className="error-text"
            />

            <label>Confirmar contraseña:</label>
            <Field
              name="confirmPassword"
              type="password"
              className="input-field"
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="error-text"
            />

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              Registrarse
            </button>
          </Form>
        )}
      </Formik>

       {message !== "" ? (
        <p style={{ color: success ? "green" : "red", marginTop: "1rem" }}>{message}</p>
      ): <></>}
    </>
  );
};

export default UserRegister;
