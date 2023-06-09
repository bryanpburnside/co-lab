import { Router } from 'express';
const Login = Router();

Login.get('/', (req, res) => {
  console.log('login');
})

export default Login;
