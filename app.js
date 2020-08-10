const fs = require('fs');
const path = require('path');
const { askQuestions } = require('./questions');

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}

function getFiles(path) {
  return fs.readdirSync(path).filter(function (file) {
    return !fs.statSync(path + '/' + file).isDirectory();
  });
}

if (process.argv[2] === 'create') {
  if (process.argv[3] == 'category') {
    let category = '';
    askQuestions(['Enter name of category']).then((answer) => {
      category = answer[0];
      fs.mkdir(`${__dirname}\\${category}`, (err) => {
        if (err) {
          if (err.code == 'EEXIST') {
            return console.log(`Category '${category}' already exists`);
          }
          return console.log(err.msg);
        }

        if (!err) {
          console.log(`New category with the name ${answer} created`);
        }
      });
    });
  }
  if (process.argv[3] == 'note') {
    let title = '';
    let body = '';
    let category = '';

    askQuestions([
      'Enter Note category  ',
      'Enter Note Title  ',
      'Enter Note Body  ',
    ]).then((answers) => {
      category = answers[0] || 'unclassified';
      title = answers[1];
      body = answers[2];

      fs.access(`./${category}`, function (error) {
        if (error) {
          askQuestions([
            `Do you wish to create?, || type yes to create  `,
          ]).then((answers) => {
            if (answers[0].toLowerCase() == 'yes') {
              fs.mkdirSync(`${__dirname}\\${category}`);
              fs.writeFileSync(
                path.join(__dirname, category, title),
                body,
                'UTF8'
              );
              console.warn(`New Note created successfully`);
            } else {
              process.kill;
            }
          });
        }
      });
      try {
        fs.writeFileSync(path.join(__dirname, category, title), body, 'UTF8');
        console.log(`New Note created successfully`);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log(`category ${category} does not exist`);
        }
      }
    });
  }
}

if (process.argv[2] === 'list') {
  if (process.argv[3] == 'category' && process.argv[4]) {
    const files = getFiles(path.join(__dirname, process.argv[4]));

    files.forEach((file) => {
      console.log(file);
    });
  } else if (process.argv[3] == 'category') {
    let directories = getDirectories(__dirname);
    directories = directories.filter((dir) => {
      if (!/^\..*/.test(dir)) {
        return dir;
      }
    });

    directories.forEach((directory) => {
      console.log(directory);
    });
  } else if (process.argv[3] == 'notes') {
    let results = [];
    let directories = getDirectories(__dirname);
    directories = directories.filter((dir) => {
      if (!/^\..*/.test(dir)) {
        return dir;
      }
    });
    directories.forEach((directory) => {
      const files = getFiles(path.join(__dirname, directory));

      files.forEach((file) => {
        results.push({
          title: file,
          category: directory,
        });
      });
    });
    console.table(results);
  }
}

if (process.argv[2] === 'read') {
  let directories = getDirectories(__dirname);
  directories = directories.filter((dir) => {
    if (!/^\..*/.test(dir)) {
      return dir;
    }
  });
  let fileStatus = false;
  directories.forEach((directory) => {
    const filePath = path.join(__dirname, directory, process.argv[3]);

    try {
      if (fs.existsSync(filePath)) {
        fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
          if (!err) {
            fileStatus = true;
            console.log('Title: ' + process.argv[3]);
            console.log('Category: ' + directory);
            console.log('Body: ' + data);
          } else {
            console.log(err);
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  });
  if (!fileStatus) {
    console.error('Note not found');
    console.warn(
      'Use can use the list Note command to view the list of all saved notes'
    );
  }
}

if (process.argv[2] === 'delete') {
  let directories = getDirectories(__dirname);
  directories = directories.filter((dir) => {
    if (!/^\..*/.test(dir)) {
      return dir;
    }
  });
  let fileStatus = false;
  directories.forEach((directory) => {
    const filePath = path.join(__dirname, directory, process.argv[3]);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (!err) {
            fileStatus = true;
            console.log(process.argv[3] + ' deleted successfully');
          } else {
            console.log(err);
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  });
  if (!fileStatus) {
    console.error('Note not found');
    console.warn(
      'Use can use the list Note command to view the list of all saved notes'
    );
  }
}
