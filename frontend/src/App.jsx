import { Route, Routes, BrowserRouter } from "react-router-dom";
import NewTask from "./pages/NewTask.jsx";
import SignUp from "./pages/SignUp.jsx";
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn.jsx";
import Task from "./pages/Task.jsx";
import EditTask from "./pages/EditTask.jsx";
import MyTodos from "./pages/MyTodos.jsx";
import AuthCallback from "./pages/AuthCallback";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mytodos" element={<MyTodos />} />
          <Route path="/new" element={<NewTask />} />
          <Route path="/edit/:id" element={<EditTask />} />
          <Route path="/:id" element={<Task />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="signin" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
