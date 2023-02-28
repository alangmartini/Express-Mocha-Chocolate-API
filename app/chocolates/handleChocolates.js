const { join } = require('path');
const { writeChocolates } = require('./writeChocolates');
const { readChocolates } = require('./readChocolates');

const path = join(__dirname, './data/chocolates.txt');

async function getChocolates() {
  const chocolates = await readChocolates(path);

  return chocolates;
}

function findChocolateIndexById(currentChocolates, id) {
  const indexChocolateToBeUpdated = currentChocolates
  .findIndex((choco) => choco.id === id);

  if (indexChocolateToBeUpdated === -1) {
    throw new Error('Chocolate not found');
  }

  return indexChocolateToBeUpdated;
}

const updateChocolates = async (newChocolateInfo) => {
  try {
    const currentChocolates = await readChocolates(path);

    const indexChocolateToBeUpdated = findChocolateIndexById(currentChocolates, newChocolateInfo.id);

    currentChocolates[indexChocolateToBeUpdated] = newChocolateInfo;

    await writeChocolates(path, currentChocolates);

    return 'Sucefully updated chocolate';
  } catch (error) {
      throw new Error(`Failed to update chocolate: ${error}`);
  }
};

const addChocolate = async (newChocolate) => {
  try {
    const currentChocolates = await readChocolates(path);

    const newChocolateID = currentChocolates.length + 1;
    newChocolate.id = `${newChocolateID}`;
    
    const newChocolates = [...currentChocolates, newChocolate];

    await writeChocolates(path, newChocolates);

    return 'Sucefully added new chocolate';
  } catch (error) {
    throw new Error(`Failed to add new chocolate: ${error}`);
  }
};

const removeChocolate = async (id) => {
  const currentChocolates = await readChocolates(path);

  try {
    const indexChocolateToBeRemoved = findChocolateIndexById(currentChocolates, id)

    currentChocolates.splice(indexChocolateToBeRemoved, 1);

    await writeChocolates(path, currentChocolates);
  } catch(error) {
    throw new Error(`Couldn't write chocolate! Error: ${error}`);
  }
}

module.exports = {
  getChocolates,
  updateChocolates,
  addChocolate,
  removeChocolate,
};
