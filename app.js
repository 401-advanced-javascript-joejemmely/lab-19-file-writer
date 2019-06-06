'use strict';

const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const events = require('./utils/events.js');
const QClient = require('@nmq/q/client');

/**
 * Async function to read, transform, and write
 * @param {*} file
 */
const alterFile = async file => {
  try {
    const buffer = await readFileAsync(file);
    const upperCasedContent = buffer.toString().toUpperCase();
    await writeFileAsync(file, Buffer.from(upperCasedContent));
    await QClient.publish('files', events.files.SAVE, upperCasedContent);
  } catch (error) {
    await QClient.publish(
      'files',
      events.files.ERROR,
      'Something went horribly wrong…'
    );
  }
};

let file = process.argv.slice(2).shift();
alterFile(file);
