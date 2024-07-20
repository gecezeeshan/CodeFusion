const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

var  router = express.Router();
const app = express();
const PORT = 5000;
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:  true }));

app.use('/api', router);

router.use((request, response, next) => {
  response.write('<div>test</div>')
  next();
});

router.route('/test').get((request, response,next) => {
  console.log('middleware');
  next();
  });

// PostgreSQL Pool
const pool = new Pool({  
  host: 'localhost',
  database: 'Portfolio',
  user: 'postgres',
  password: '123456',
  port: 5433,
});



// CRUD Routes for Category
app.post('/categories', async (req, res) => {
  const { name } = req.body;
  const result = await pool.query('INSERT INTO Category (name) VALUES ($1) RETURNING *', [name]);
  res.send(result.rows[0]);
});

app.get('/categories', async (req, res) => {
  const result = await pool.query('SELECT * FROM Category');
  res.send(result.rows);
});

app.put('/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await pool.query('UPDATE Category SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
  res.send(result.rows[0]);
});

app.delete('/categories/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM Category WHERE id = $1', [id]);
  res.send({ message: 'Category deleted' });
});

// CRUD Routes for Article
app.post('/articles', async (req, res) => {
  const { title, content, category_id } = req.body;
  const result = await pool.query('INSERT INTO Article (title, content, category_id) VALUES ($1, $2, $3) RETURNING *', [title, content, category_id]);
  res.send(result.rows[0]);
});

app.get('/articles', async (req, res) => {
  const result = await pool.query('SELECT * FROM Article');
  res.send(result.rows);
});

app.put('/articles/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, category_id } = req.body;
  const result = await pool.query('UPDATE Article SET title = $1, content = $2, category_id = $3 WHERE id = $4 RETURNING *', [title, content, category_id, id]);
  res.send(result.rows[0]);
});

app.delete('/articles/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM Article WHERE id = $1', [id]);
  res.send({ message: 'Article deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



console.log('Order API is runnning at ' + PORT);