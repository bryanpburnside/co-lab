import Express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const { PORT } = process.env;

const app = Express();

app.listen(PORT, () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
})