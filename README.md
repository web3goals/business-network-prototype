# 🌍 Business Network

Find a reliable partner based on feedback from other people.

## 🔗 Artifacts

- Application - [business-network.vercel.app](https://business-network.vercel.app/)
- Scripts to generate VC and VP - [/tools](https://github.com/web3goals/business-network-prototype/tree/main/tools)
- Contracts (zkSync Testnet):
  - Partner Factory - [0xa33550bcf7F4FE02F9087A55dF6A9078488e1e0A](https://goerli.explorer.zksync.io/address/0xa33550bcf7F4FE02F9087A55dF6A9078488e1e0A)

## ✨ About

Business Network is an application for founders, investors, developers and artists where you can find a reliable partner based on feedback from other people.

## ⚒️ How it's made

To create this project, I used:

- Lens Protocol to display the social profiles of all business network users.
- Push Protocol as a provider of chats between users.
- Onyx as a provider of verified presentation with private feedback.
- And zkSync network to store smart contract that creates a paymaster for each partner who wants to sponsor transactions with feedback.

## 🔮 What's next

- Add feature to post feedback with onchain or offchain proofs.
- Add feature to create private feedback using web application instead of a console tool.
- Improve UI to provide more convenient ways to find the right partner.

## 🏗️ Architecture

![Architecture](/architecture.png)
