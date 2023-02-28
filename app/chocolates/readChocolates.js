const fs = require('fs/promises');

const readChocolates = async (path) => {
  if (!path || typeof path !== 'string' || !path.trim().length) {
    throw new Error(`Invalid file path: ${path}.`);
  }

  try {
    const allChocolates = await fs.readFile(path, 'utf8');
    const parsedChocolates = JSON.parse(allChocolates);
    
    if (!allChocolates) {
      throw new Error('Reading of chocolate file returned null, undefined or empty');
    }

    if (!parsedChocolates.chocolates) {
      throw new Error('\'Chocolates\' property is missing from chocolate object. Please add it.');
    }

    return parsedChocolates.chocolates;
  } catch (error) {
    throw new Error(`Failed to read chocolates from file: ${error.message}`);
  }
};

module.exports = {
  readChocolates,
};