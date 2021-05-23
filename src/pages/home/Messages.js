import React, { Fragment, useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useMessageDispatch, useMessageState } from "../../context/message";

import Message from "./Message";

const GET_MESSAGES = gql`
	query getMessages($from: String!) {
		getMessages(from: $from) {
			id
			from
			to
			content
			createdAt
		}
	}
`;

const SEND_MESSAGE = gql`
	mutation sendMessage($to: String!, $content: String!) {
		sendMessage(to: $to, content: $content) {
			id
			from
			to
			content
			createdAt
		}
	}
`;

const EDIT_MESSAGE = gql`
	mutation editMessage($id: ID!, $content: String!) {
		editMessage(id: $id, content: $content) {
			id
			from
			to
			content
			createdAt
		}
	}
`;

const DELETE_MESSAGE = gql`
	mutation deleteMessage($id: ID!) {
		deleteMessage(id: $id)
	}
`;

export default function Messages() {
	const { users } = useMessageState();
	const dispatch = useMessageDispatch();
	const [content, setContent] = useState("");
	const [isEdit, setIsEdit] = useState({ state: false, id: "" });

	const selectedUser = users?.find((u) => u.selected === true);
	const messages = selectedUser?.messages;

	const [getMessages, { loading: messagesLoading, data: messagesData }] =
		useLazyQuery(GET_MESSAGES);

	const [sendMessages] = useMutation(SEND_MESSAGE, {
		onError: (err) => console.log(err),
	});

	const [changeMessage] = useMutation(EDIT_MESSAGE, {
		onError: (err) => console.log(err),
	});

	const [removeMessage] = useMutation(DELETE_MESSAGE, {
		onError: (err) => console.log(err),
	});

	useEffect(() => {
		if (selectedUser && !selectedUser.messges) {
			getMessages({ variables: { from: selectedUser.username } });
		}
	}, [selectedUser, dispatch]);

	useEffect(() => {
		if (messagesData) {
			dispatch({
				type: "SET_USER_MESSAGES",
				payload: {
					username: selectedUser.username,
					messages: messagesData.getMessages,
				},
			});
		}
	}, [messagesData]);

	const submitMessage = (e) => {
		e.preventDefault();

		if (content.trim() === "" || !selectedUser) return;

		sendMessages({ variables: { to: selectedUser.username, content } });
		setContent("");
	};

	const submitEditedMessage = (e) => {
		e.preventDefault();
		if (content.trim() === "" || !selectedUser) return;
		let editedContent = content;
		if (!editedContent.includes("(edited) ")) {
			editedContent = "(edited) " + editedContent;
		}
		setContent("");
		changeMessage({
			variables: { id: isEdit.id, content: editedContent },
		});
		setIsEdit({ state: false, id: "" });
	};

	const deleteMessage = (e, id) => {
		e.preventDefault();
		changeMessage({
			variables: { id: id, content: "(deleted) " + content },
		});
		removeMessage({ variables: { id: id } });
	};

	let selectedChatMarkup;
	if (!messages && !messagesLoading) {
		selectedChatMarkup = <p className="info-text">Select a friend</p>;
	} else if (messagesLoading) {
		selectedChatMarkup = <p className="info-text">Loading...</p>;
	} else if (messages.length > 0) {
		selectedChatMarkup = messages.map((message, index) => (
			<Fragment key={message.id}>
				<Message
					message={message}
					deleteMessage={deleteMessage}
					setIsEdit={setIsEdit}
					setContent={setContent}
				/>
				{index === messages.length - 1 && (
					<div className="invisible">
						<hr className="m-0" />
					</div>
				)}
			</Fragment>
		));
	} else if (messages.length === 0) {
		selectedChatMarkup = (
			<p className="info-text">
				You are now connected! Send your first message!
			</p>
		);
	}

	return (
		<Col xs={10} md={8}>
			<div className="messages-box d-flex flex-column-reverse">
				{selectedChatMarkup}
			</div>
			<div>
				{!isEdit.state ? (
					<Form onSubmit={submitMessage}>
						<Form.Group className="d-flex align-content-center">
							<Form.Control
								type="text"
								className="rounded-pill bg-secondary border-0 text-white message-input"
								placeholder="Type a message..."
								value={content}
								onChange={(e) => setContent(e.target.value)}
							/>
							<i
								className="fas fa-paper-plane fa-2x text-secondary ml-2"
								onClick={submitMessage}
								role="button"
							></i>
						</Form.Group>
					</Form>
				) : (
					<Form onSubmit={submitEditedMessage}>
						<Form.Group className="d-flex align-content-center">
							<Form.Control
								type="text"
								className="rounded-pill bg-primary border-0 text-white message-input"
								value={content}
								onChange={(e) => setContent(e.target.value)}
							/>
							<i
								className="fas fa-edit fa-2x text-primary ml-2"
								onClick={submitEditedMessage}
								role="button"
							></i>
						</Form.Group>
					</Form>
				)}
			</div>
		</Col>
	);
}
