import React, { useEffect, useState } from "react";
import { Row, Button, Image } from "react-bootstrap";
import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useMessageDispatch } from "../../context/message";
import { gql, useSubscription } from "@apollo/client";

import Users from "./Users";
import Messages from "./Messages";

const NEW_MESSAGE = gql`
	subscription newMessage {
		newMessage {
			id
			from
			to
			content
			createdAt
		}
	}
`;

export default function Home() {
	const authDispatch = useAuthDispatch();
	const messageDispatch = useMessageDispatch();
	const { user } = useAuthState();
	const [details, setDetails] = useState(false);

	const { data: messageData, error: messageError } =
		useSubscription(NEW_MESSAGE);

	useEffect(() => {
		if (messageError) console.log(messageError);
		if (messageData) {
			const message = messageData.newMessage;
			const otherUser =
				user.username === message.to ? message.from : message.to;
			messageDispatch({
				type: "ADD_MESSAGE",
				payload: {
					username: otherUser,
					message: messageData.newMessage,
				},
			});
		}
	}, [messageError, messageData]);

	const logout = () => {
		authDispatch({ type: "LOGOUT" });
		window.location.href = "/login";
	};

	return (
		<>
			<Row className="bg-secondary justify-content-between">
				<div className="user-div d-flex  justify-content-center justify-content-md-start p-3">
					<Image src={user.imageUrl} className="user-image" />
					<div className="d-none d-md-block ml-2">
						<p className="text-info">Welcome, {user.username},</p>{" "}
						<p className="font-weight-light text-white">
							You are now connected!
						</p>
					</div>
					{details && (
						<div className="pl-5">
							<h5 className="text-white">username: {user.username}</h5>
							<h5 className="text-white">email: {user.email}</h5>
						</div>
					)}
				</div>
				<div className="d-flex">
					<Button className="bg-warning text-black-50" onClick={logout}>
						Logout
					</Button>
				</div>
			</Row>

			<Row className="bg-white">
				<Messages />
				<Users user={user} />
			</Row>
		</>
	);
}
