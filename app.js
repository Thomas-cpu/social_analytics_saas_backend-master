import { config as dotenvConfig } from 'dotenv';

dotenvConfig({
  path: `./.${process.env.NODE_ENV || 'development'}.env`,
});

import process from 'process';
const port = process.env.PORT || 9000;
import express, { json, urlencoded } from 'express';

import indexRoutes from './routes/index.js';

const main = async () => {
    const app = express();
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use('/', indexRoutes);

    app.use('*', (req, res) => res.status(404).send('404'));
    app.listen(port, () => console.log(`Server started on port ${port}`));
}

main();