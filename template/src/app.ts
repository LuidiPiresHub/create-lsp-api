import 'express-async-errors';
import express, { json } from 'express';
import cors from 'cors';
import routes from '@routes/index';
import handleErrors from '@middlewares/handleErrors';

const app = express();

app.use(json());
app.use(cors());

app.use('/users', routes.userRouter);
app.use(handleErrors);

export default app;