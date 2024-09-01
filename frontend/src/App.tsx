import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Generator from "./pages/app/generator";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

function App() {

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={<Generator />}
				/>

				<Route path="/register" element={<Register></Register>}></Route>
				<Route path="/login" element={<Login></Login>}></Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
