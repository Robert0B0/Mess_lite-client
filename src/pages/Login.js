import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			imageUrl
			email
			createdAt
			token
		}
	}
`;

export default function Login() {
	const [variables, setVariables] = useState({
		username: "",
		password: "",
	});

	const [errors, setErrors] = useState({});

	const dispatch = useAuthDispatch();

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		update(_, { data: { login: userData } }) {
			dispatch({ type: "LOGIN", payload: userData });
			window.location.href = "/";
		},
	});

	const submitLoginForm = (e) => {
		e.preventDefault();
		loginUser({ variables });
	};

	return (
		<Container className="pt-5">
			<Row className="bg-white py-5 justify-content-center">
				<Col sm={8} md={6} lg={4}>
					<h2 className="text-center">
						<i className="fas fa-paper-plane fa-1x text-black"></i> Welcome to
						Mess_lite!{" "}
					</h2>
					<h1 className="text-center">Login</h1>
					<Form onSubmit={submitLoginForm}>
						<Form.Group>
							<Form.Label className={errors.username && "text-danger"}>
								{errors.username ?? "Username"}
							</Form.Label>
							<Form.Control
								placeholder="Ben           <-Demo User username"
								type="username"
								value={variables.username}
								className={errors.username && "is-invalid"}
								onChange={(e) =>
									setVariables({ ...variables, username: e.target.value })
								}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label className={errors.password && "text-danger"}>
								{errors.password ?? "Password"}
							</Form.Label>
							<Form.Control
								placeholder="123456     <-Demo User password"
								type="password"
								value={variables.password}
								className={errors.password && "is-invalid"}
								onChange={(e) =>
									setVariables({ ...variables, password: e.target.value })
								}
							/>
						</Form.Group>

						<div className="text-center">
							<Button variant="success" type="submit" disabled={loading}>
								{loading ? "loading.." : "Login"}
							</Button>
							<br />
							<small>
								Don't have an account?{" "}
								<Link to="/register">Register here.</Link>{" "}
							</small>
						</div>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}
