require('dotenv').config();

const DEBUG = true;
const READ_ONLY = false;
const TEST_BUY = true;
let allTimeHighEth = 2042.93; // Feb 20, 2021
let maxBuyPrice = allTimeHighEth * 0.90;
const buySize = 1000;

const { ethers } = require('ethers');
const privateKey = process.env.PRIVATE_KEY;
const walletAddress = process.env.WALLET_ADDRESS;
const provider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_KEY);

const wallet = new ethers.Wallet(privateKey, provider);

const UniswapV2Pair = require('./abis/IUniswapV2Pair.json');
const UniswapV2Factory = require('./abis/IUniswapV2Factory.json');

const runBot = async () => {
  const uniswapFactory = new ethers.Contract(
    '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    UniswapV2Factory.abi, wallet,
  );
  const daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
  const wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

  let uniswapEthDai;

  const loadPair = async () => {
    uniswapEthDai = new ethers.Contract(
      await uniswapFactory.getPair(wethAddress, daiAddress),
      UniswapV2Pair.abi, wallet,
    );
  };

  await loadPair();

  provider.on('block', async (blockNumber) => {
    try {
      if (DEBUG) { 
        console.log(`blockNumber ${blockNumber}`);
      };

      const uniswapReserves = await uniswapEthDai.getReserves();

      const reserve0Uni = Number(ethers.utils.formatUnits(uniswapReserves[0], 18));
      const reserve1Uni = Number(ethers.utils.formatUnits(uniswapReserves[1], 18));
      const reserveTimestamp = Date(uniswapReserves[2]);

      const priceUniswap = reserve0Uni / reserve1Uni;
      if (DEBUG) {
        console.log(`DAI/ETH ${priceUniswap.toFixed(2)}`);
        console.log(reserveTimestamp);
      };
      if (priceUniswap < maxBuyPrice || TEST_BUY) {
        console.log('low price triggered buy order');
        if (READ_ONLY == false) {
          console.log('creating buy transaction');
          console.log(`DAI/ETH ${priceUniswap.toFixed(2)}`);
          console.log(reserveTimestamp);
          // create transaction
          const gasLimit = await uniswapEthDai.estimateGas.swap(
            buySize,
            0,
            walletAddress,
            ethers.utils.toUtf8Bytes('1'),
          );
          console.log(`gasLimit ${gasLimit}`);
          // console.log(`gasLimit ${gasLimit.toString()}`);

          const gasPrice = await wallet.getGasPrice();
          console.log(`gasPrice ${gasPrice.toString()}`);
          console.log(Number(ethers.utils.formatEther(gasPrice)));

          const gasCost = Number(ethers.utils.formatEther(gasPrice.mul(gasLimit)));
          console.log(`gasCost ${gasCost}`);

          // execute transaction
        };
        console.log('exiting');
        process.kill(process.pid, 'SIGTERM');
      } else if (DEBUG) {
        console.log('price too high');
      };

    } catch (err) {
      console.error(err);
    }
  });
};

console.log('Bot started!');

runBot();
