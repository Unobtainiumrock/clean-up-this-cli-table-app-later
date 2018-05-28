
const mysql = require('mysql');

class Mysql {
  constructor(config) {
    this.config = mysql.createConnection(config);
  }

  query(str, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(str, args, (err,res) => {
        if (err){ 
          throw err
          return reject(err);
        }
        resolve(res);
      });
    });
  }

  close() {
    return new Promise((resolve,reject) => {
      this.connection.end(err => {
        if(err) {
          return reject(err);
        }
        resolve();
      })
    })
  }

}

module.exports = Mysql;
