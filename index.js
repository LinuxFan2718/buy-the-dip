require('dotenv').config();

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
      console.log(`blockNumber ${blockNumber}`);

      const uniswapReserves = await uniswapEthDai.getReserves();

      const reserve0Uni = Number(ethers.utils.formatUnits(uniswapReserves[0], 18));
      const reserve1Uni = Number(ethers.utils.formatUnits(uniswapReserves[1], 18));

      const priceUniswap = reserve0Uni / reserve1Uni;
      console.log(`DAI/ETH ${priceUniswap.toFixed(2)}`);
    } catch (err) {
      console.error(err);
    }
  });
};

console.log('Bot started!');

runBot();
