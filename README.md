# buy-the-dip
bot that buys the dip. [Based on this bot](https://github.com/pedrobergamini/uni-sushi-flashloaner). [Read more](https://blog.infura.io/build-a-flash-loan-arbitrage-bot-on-infura-part-ii/).

Anyone who gets your private key can take all of your money. Don't paste it
online or check it into git. Don't run code without understanding it. The
blockchain is dark and full of terrors.

## How to set up

Clone this repo and enter the directory.

```bash
npm install
cp .env.example .env
```

### Connecting your wallet and infura

Now edit `.env`. Do not modify the part of gitignore that excludes this file
from your git history, or show anyone your private key, especially in DMs on
discord.

#### PRIVATE KEY

[How to get your private key out of Metamask](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)

#### WALLET ADDRESS

Simply cut and paste your public wallet address associated with the
private key.

#### INFURA KEY

Create an account on Infura, create an Ethereum app, visit your Settings page,
and paste your "project ID" here.

## How to run

```bash
node index.js
```

You should see the bot start. Currently it loops forever, and prints out the
block number and current Uniswap price for DAI/ETH trades.

Exit by sending SIGINT (pressing Control C).