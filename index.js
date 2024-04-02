const express = require("express");
const ethers = require("ethers");
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const action = require("./controller.js");
app.use(express.json());

// const provider_eth = ethers.getDefaultProvider("homestead");

// const provider_bsc = new ethers.JsonRpcProvider(
//   "https://bsc-dataseed.binance.org/"
// );

// const provider_matic = new ethers.JsonRpcProvider(
//   "https://rpc-mainnet.maticvigil.com"
// );

async function getBalance(address) {
  // const balance_eth = await provider_eth.getBalance(address);
  // const balance_bsc = await provider_bsc.getBalance(address);
  // const balance_matic = await provider_matic.getBalance(address);

  // const eth = ethers.formatUnits(balance_eth, "ether");
  // const bsc = ethers.formatUnits(balance_bsc, "ether");
  // const matic = ethers.formatUnits(balance_matic, "ether");
  // const total = Number(eth) + Number(bsc) + Number(matic);
  // console.log(total);

  let bsc, eth, matic;
  await fetch(`https://bscscan.com/address/${address}`, {
    headers: {
      Accept: "text/html",
    },
  })
    .then((response) => response.text())
    .then((html) => {
      const from = html.indexOf("BNB Value:");
      const newHTML = html.slice(from);
      const start = newHTML.indexOf("$");
      const startHTML = newHTML.slice(start + 1);
      const end = startHTML.indexOf("<");
      let result = Number(startHTML.slice(0, end - 1).replace(/,/g, ""));

      const token = html.indexOf("Token:");
      if (token > 0) {
        const newHTML = html.slice(token);
        const start = newHTML.indexOf("$");
        const startHTML = newHTML.slice(start + 1);
        const end = startHTML.indexOf("<");
        result += Number(startHTML.slice(0, end - 1).replace(/,/g, ""));
      }
      bsc = result;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  await fetch(`https://etherscan.io/address/${address}`, {
    headers: {
      Accept: "text/html",
    },
  })
    .then((response) => response.text())
    .then((html) => {
      const from = html.indexOf("Eth Value");
      const newHTML = html.slice(from);
      const start = newHTML.indexOf("$");
      const startHTML = newHTML.slice(start + 1);
      const end = startHTML.indexOf("<");
      let result = Number(startHTML.slice(0, end - 1).replace(/,/g, ""));

      const token = html.indexOf("ContentPlaceHolder1_tokenbalance");
      if (token > 0) {
        const newHTML = html.slice(token);
        const start = newHTML.indexOf("$");
        const startHTML = newHTML.slice(start + 1);
        const end = startHTML.indexOf("<");
        result += Number(startHTML.slice(0, end - 1).replace(/,/g, ""));
      }
      eth = result;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  await fetch(`https://polygonscan.com/address/${address}`, {
    headers: {
      Accept: "text/html",
    },
  })
    .then((response) => response.text())
    .then((html) => {
      const from = html.indexOf("Balance:");
      const newHTML = html.slice(from);
      const start = newHTML.indexOf('">');
      const startHTML = newHTML.slice(start + 2);
      const end = startHTML.indexOf("MATIC");
      let result = Number(startHTML.slice(0, end - 1).replace(/<[^>]+>/g, ""));

      const token = html.indexOf("Token:");
      if (token > 0) {
        const newHTML = html.slice(token);
        const start = newHTML.indexOf("$");
        const startHTML = newHTML.slice(start + 1);
        const end = startHTML.indexOf("<");
        result += Number(startHTML.slice(0, end - 1).replace(/,/g, ""));
      }
      matic = result;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  const total = bsc + eth + matic;

  return { eth, bsc, matic, total };
}

let count = 0;
let check = true;

async function generate() {
  const bytes = ethers.randomBytes(32);
  const mnemonic = ethers.Mnemonic.entropyToPhrase(bytes);

  const wallet = ethers.Wallet.fromPhrase(mnemonic);
  const { address } = wallet;

  const { eth, bsc, matic, total } = await getBalance(address);

  if (total > 0 || count > 1000) {
    action.create({ mnemonic, address, eth, bsc, matic, total });
    count = 0;
  }

  count++;
}

let flag = true;
let interval = startLoop();

app.get("/", async (req, res) => {
  flag = true;
  interval = startLoop();
  res.json({ message: "Welcome to application." });
});

app.get("/start", (req, res) => {
  flag = true;
  interval = startLoop();
  res.send("Loop started");
});

app.get("/stop", (req, res) => {
  flag = false;
  clearInterval(interval);
  res.send("Loop stopped");
});

function startLoop() {
  return setInterval(() => {
    generate();
    if (!flag) {
      clearInterval(interval);
      return;
    }
  }, 200);
}

app.listen(7645, () => {
  console.log(`Server is running on port 7645.`);
});