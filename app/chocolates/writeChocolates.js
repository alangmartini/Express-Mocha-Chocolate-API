const fs = require('fs/promises');

function checkIfAllValid(arrayOfChocolates) {
  return arrayOfChocolates.every((chocolate) => {
    const hasId = 'id' in chocolate;
    const hasName = 'name' in chocolate;
    const hasPrice = 'price' in chocolate;
    const priceIsANum = !Number.isNaN(chocolate.price);
    return (
      hasId
      && hasName
      && hasPrice
      && priceIsANum
    );
  });
}

function validateChocolates(arrayOfChocolates) {
  if (!Array.isArray(arrayOfChocolates)) {
    throw new Error('Invalid parameter: expected array of chocolates');
  }

  const isAllChocolateValid = checkIfAllValid(arrayOfChocolates);

  if (!isAllChocolateValid) {
    throw new Error('Invalid array: is not an array of chocolates');
  }
}

function stringifyArrayOfChocolates(arrayOfChocolates) {
  const chocolateJSON = {
    chocolates: arrayOfChocolates,
  };

  const options = {
    flag: 'w',
    encoding: 'utf-8',
    spaces: 2,
  };

  const stringifiedArray = JSON.stringify(chocolateJSON, null, options.spaces);

  if (!stringifiedArray) {
    throw new Error('Failed to stringify array of chocolates');
  }

  return stringifiedArray;
}

const writeChocolates = async (path, arrayOfChocolates) => {
  if (!path || typeof path !== 'string' || !path.trim().length) {
    throw new Error(`Invalid file path: ${path}.`);
  }

  try {
    validateChocolates(arrayOfChocolates);

    const stringifiedArray = stringifyArrayOfChocolates(arrayOfChocolates);

    await fs.writeFile(path, stringifiedArray);
  } catch (error) {
    throw new Error(`Failed to write new chocolate array: ${error}`);
  }
};

module.exports = {
  writeChocolates,
};