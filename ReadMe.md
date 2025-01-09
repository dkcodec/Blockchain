# AI Model Marketplace

A simple decentralized marketplace for listing, purchasing, and rating AI models on the Ethereum blockchain.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Screenshots](#screenshots)
6. [Examples](#examples)
7. [License](#license)

---

## Overview

This project demonstrates a full-stack dApp (decentralized application) built with:

- **Solidity** for smart contracts
- **React** (or any other frontend framework) for the UI
- **Hardhat/Truffle** for development and deployment

## Features

- **List Models**: Users can list a new AI model by specifying its name, description, and price.
- **Purchase Models**: Buyers can purchase a model by sending Ether to the model’s creator.
- **Rate Models**: Buyers can rate a purchased model to indicate quality.
- **Withdraw Funds**: Contract owner can withdraw accumulated fees (if any).
- **View Details**: Anyone can view a model’s details, including average rating.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/AI-Model-Marketplace.git
   cd AI-Model-Marketplace
   ```

2. **Install dependencies (root and frontend)**:

   ```bash
   # Install dependencies for contracts/test
   npm install

   # Move into client folder and install frontend dependencies
   cd client
   npm install
   ```

3. **Compile and Test (in the root folder)**:

   ```bash
   npx hardhat compile
   npx hardhat test
   ```

4. **Deploy**:

   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

   Make sure you have a local blockchain running (e.g., Hardhat node or Ganache).

5. **Run the Frontend**:

   ```bash
   cd client
   npm run start
   ```

   The DApp will be accessible at [http://localhost:3000](http://localhost:3000).

## Usage

- **Connect Wallet**: Ensure you have MetaMask or another web3 provider installed.
- **List Model**: Fill in the model name, description, and price. Submit the transaction.
- **Purchase Model**: Click the “Purchase” button and confirm the transaction in your wallet.
- **Rate Model**: Provide a rating (1-5) and confirm the transaction.
- **Withdraw Funds (Owner only)**: If a fee mechanism is implemented, the contract owner can withdraw.

Screenshots

## Скриншоты

![Форма добавления модели](./screenshots/list-model-form.png 'Форма добавления модели')

![Покупка модели](./screenshots/welcome.png 'Покупка модели')

![Оценка модели](./screenshots/2.png 'Оценка модели')

![Вывод средств владельцем](./screenshots/3.png 'Вывод средств владельцем')

![Вывод средств владельцем](./screenshots/4.png 'Вывод средств владельцем')

![Вывод средств владельцем](./screenshots/5.png 'Вывод средств владельцем')

![Вывод средств владельцем](./screenshots/6.png 'Вывод средств владельцем')

---

## LICENSE

If you choose MIT, your `LICENSE` file could look like:
