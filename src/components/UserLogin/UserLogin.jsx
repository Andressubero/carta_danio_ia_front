import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./userLogin.css"; 
import { useState } from "react";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Mínimo 3 caracteres")
    .required("Nombre de usuario requerido"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Contraseña requerida"),
});

const UserLogin = () => {
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState("");

  const handleSubmit = async (values, actions) => {
    try {
      const apiUrl = import.meta.env.VITE_RUTA_BACKEND_LOCAL;
      const response = await fetch(`${apiUrl}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
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
      <h1>Iniciar sesión</h1>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <label>Nombre de usuario:</label>
            <Field name="username" type="text" className="input-field" />
            <ErrorMessage
              name="username"
              component="div"
              className="error-text"
            />

            <label>Contraseña:</label>
            <Field name="password" type="password" className="input-field" />
            <ErrorMessage
              name="password"
              component="div"
              className="error-text"
            />

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              Ingresar
            </button>
          </Form>
        )}
      </Formik>

      {message !== "" && (
        <p
          style={{
            color: success ? "green" : "red",
            marginTop: "1rem",
          }}
        >
          {message}
        </p>
      )}
    </>
  );
};

export default UserLogin;
