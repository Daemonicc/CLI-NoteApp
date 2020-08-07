const fs = require('fs');
const path = require('path');
const { askQuestions } = require('./questions');

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
