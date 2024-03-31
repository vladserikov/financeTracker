import app from './app';
import { PORT } from './utils/config';

app.listen(PORT || 3001, () => {
    console.log('server start');
});
