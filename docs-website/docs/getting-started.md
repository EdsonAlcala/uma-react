---
id: getting-started
sidebar_position: 1
slug: /
---

# Getting Started

Let's face it, most of the UMA DApps out there are just simply forks of the [EMP tools](https://github.com/UMAprotocol/emp-tools) project. It is not easy to create a DApp from scratch and the [UMA protocol](https://github.com/UMAprotocol/protocol) is complex.

The UMA React SDK helps you to build decentralized synthetic applications in React very quickly and without the tears of the EMP tools.

The UMA React SDK gives you:

- Read only data hooks, used to get any [EMP](https://docs.umaproject.org/synthetic-tokens/expiring-synthetic-tokens) and [LSP](https://docs.umaproject.org/synthetic-tokens/long-short-pair) (WIP) information.

- EMP UI controls, used to create and manage EMP positions.

- LSP UI controls(WIP), used to create and manage LSP positions.

- Prices for collaterals and synthetics, thanks to the UMA API integration.

### Install

You can install using [NPM](https://www.npmjs.com)

```shell
npm install uma-react
```

or with [Yarn](https://yarnpkg.com/)

```shell
yarn add uma-react
```

And install peer dependencies

```shell
npm install bnc-onboard ethers @material-ui/core @material-ui/icons web3-utils
```
or

```shell
yarn add bnc-onboard ethers @material-ui/core @material-ui/icons web3-utils
```

### Usage

```javascript
import { useEMPProvider } from 'uma-react';
```

See [Hooks](./hooks/useConfig) section for more details.