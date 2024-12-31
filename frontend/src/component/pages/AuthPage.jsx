import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import landingImage from "../../assets/rb_2744.png";
import { TextField, Button, Typography } from "@mui/material";
import axios, { Axios } from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import { toast } from "react-toastify";

const AuthPage = () => {
  // Form validation schema using Yup
  const navigate = useNavigate()
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  // Formik hook
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try{
        const authData = await axios.post("http://localhost:8000/login", values, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        
        if(authData.status===200){
          localStorage.setItem('token', authData.data.access_token)
          const tokenDecode = jwtDecode(authData.data.access_token);
          if(tokenDecode.role===1){
            navigate("/home")
          }
          else if(tokenDecode.role===2){
            navigate("/datamanagement")
          }
          
        }
      }
      catch(errors){
        console.log("authData", errors)
        toast.error(errors?.response?.data?.detail)
      }
    },
  });

  return (
    <div className="authmain flex flex-row items-center">
      <div className="image-container">
        <img src={landingImage} alt="Login" />
      </div>
      <div className="form-container">
        <div className="login-form-container">
          <Typography variant="h4">Login</Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              className="input-field"
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              className="input-field"
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="login-btn"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
