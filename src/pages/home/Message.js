import React from "react";
import classNames from "classnames";
import { useAuthState } from "../../context/auth";
import moment from "moment";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function Message({
	message,
	deleteMessage,
	setIsEdit,
	setContent,
}) {
	const { user } = useAuthState();
	const sent = message.from === user.username;
	const recieved = !sent;

	return (
		<OverlayTrigger
			placement="top"
			overlay={
				<Tooltip>
					{moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
				</Tooltip>
			}
			transition={false}
		>
			<div
				className={classNames("d-flex my-3", {
					"ml-auto": sent,
					"mr-auto": recieved,
				})}
			>
				<div
					className={classNames("py-2 px-3 rounded-pill", {
						"bg-primary": sent,
						"bg-secondary": recieved,
					})}
				>
					<p className="text-white" key={message.id}>
						{message.content}
						{"   "}
						{sent && (
							<>
								<OverlayTrigger
									placement="bottom"
									overlay={<Tooltip>Edit Message</Tooltip>}
									transition={false}
								>
									<i
										onClick={(e) => {
											setIsEdit({ state: true, id: message.id });
											setContent(message.content.replace("(edited) ", ""));
										}}
										className="fas fa-edit fa-1x text-black"
									></i>
								</OverlayTrigger>
								{"   "}
								<OverlayTrigger
									placement="bottom"
									overlay={<Tooltip>Delete Message</Tooltip>}
									transition={false}
								>
									<i
										onClick={(e) => deleteMessage(e, message.id)}
										className="fas fa-trash fa-1x text-black"
									></i>
								</OverlayTrigger>
							</>
						)}
					</p>
				</div>
			</div>
		</OverlayTrigger>
	);
}
