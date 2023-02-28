const express = require('express');
const { 
  getChocolates,
  updateChocolates,
  addChocolate,
  removeChocolate,
} = require('./chocolates/handleChocolates');

const app = express();
app.use(express.json());

app.get('/chocolates', async (req, res) => {
  const chocolates = await getChocolates();

  res.status(200).json(chocolates);
});

app.put('/chocolates/:id', async (req, res) => {
  const newChocolate = req.body;
  try {
    await updateChocolates(newChocolate);

    res.status(200).json({
      message: 'Sucessfully updated chocolate',
      status: 200,
      chocolate: newChocolate,
    });
  } catch (error) {
    res.status(400).send('Failed to update chocolate');
  }
});

app.post('/chocolates/new', async (req, res) => {
  const newChocolate = req.body;

  try {
    await addChocolate(newChocolate);

    res.status(201).json({
      message: 'Chocolate sucessfuly added!',
      status: 201,
    });
  } catch (error) {
    res.status(400).send(`Failed to add chocolate: ${error}`);
  }
});

app.delete('/chocolates/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const removedChocolate = await removeChocolate(id);

    res.status(201).json({
      message: 'Removed chocolate sucessfully',
      status:201,
      removedChocolate: removedChocolate,
    })
  } catch(error) {
    res.status(400).send(`Failed to remove chocolate: ${error}`)
  }
});

module.exports = app;