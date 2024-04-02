const sql = require("./db.js");

// constructor
const Test = function (test) {
  this.mnemonic = test.mnemonic;
  this.address = test.address;
  this.eth = test.eth;
  this.bsc = test.bsc;
  this.matic = test.matic;
  this.total = test.total;
};

Test.create = (newData, result) => {
  sql.query("INSERT INTO test SET ?", newData, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newData });
  });
};

module.exports = Test;
