import {
  ApolloClient,
  InMemoryCache,
  // ApolloLink,
  HttpLink,
} from "@apollo/client";
import fetch from 'cross-fetch';

// const umaLinkKovan = new HttpLink({
//   uri: "https://api.thegraph.com/subgraphs/name/umaprotocol/uma-kovan",
// });
const umaLinkMainnet = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/protofire/uma", fetch
});
// const balancerLink = new HttpLink({
//   uri: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer",
// });

// Uses ApolloLink's directional composition logic, docs: https://www.apollographql.com/docs/react/api/link/introduction/#directional-composition
// const umaLinks = ApolloLink.split(
//   (operation) => operation.getContext().clientName === "UMA42",
//   // umaLinkKovan,
//   umaLinkMainnet
// );

// import { ApolloClient, HttpLink } from '@apollo/client';
// const client = new ApolloClient({
//   link: new HttpLink({ uri: '/graphql', fetch })
// });

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  // We handle more than 2 links by composing directional composition, idea from: https://www.loudnoises.us/next-js-two-apollo-clients-two-graphql-data-sources-the-easy-way/
  link: umaLinkMainnet //"https://api.thegraph.com/subgraphs/name/protofire/uma"
});
