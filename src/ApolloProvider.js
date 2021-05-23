import React from "react";
import App from "./App";
import { setContext } from "apollo-link-context";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
	split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

let httpLink = createHttpLink({
	uri: "https://mess-lite-server.herokuapp.com/",
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem("token");
	return {
		headers: {
			...headers,
			Authorization: token ? `Bearer ${token}` : "",
		},
	};
});

httpLink = authLink.concat(httpLink);

const wsLink = new WebSocketLink({
	uri: `ws://localhost:5000/graphql`,
	options: {
		reconnect: true,
		connectionParams: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	},
});

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === "OperationDefinition" &&
			definition.operation === "subscription"
		);
	},
	wsLink,
	httpLink
);

const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache(),
});
export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
