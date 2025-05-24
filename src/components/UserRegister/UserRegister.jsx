import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./userRegister.css";

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
  return (
    <>
      <h1>Registrate</h1>
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          console.log("Datos enviados:", values);
          actions.setSubmitting(false);
          actions.resetForm();
          alert("¡Registro exitoso!");
        }}
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
    </>
  );
};

export default UserRegister;
