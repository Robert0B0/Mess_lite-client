import React from "react";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import "./App.scss";
import { Container } from "react-bootstrap";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/home/Home";

import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";
import DynamicRoute from "./util/DynamicRoute";

function App() {
	return (
		<AuthProvider>
			<MessageProvider>
				<BrowserRouter>
					<Container className="pt-5">
						<Switch>
							<DynamicRoute exact path="/" component={Home} authenticated />
							<DynamicRoute exact path="/login" component={Login} guest />
							<DynamicRoute exact path="/register" component={Register} guest />
							<DynamicRoute
								render={() => <Redirect to={{ pathname: "/" }} />}
							/>
						</Switch>
					</Container>
				</BrowserRouter>
			</MessageProvider>
		</AuthProvider>
	);
}

export default App;
