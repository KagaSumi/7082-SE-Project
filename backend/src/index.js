const app = require('./app');
const { testConnection } = require('./services/database');

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    testConnection()
});
