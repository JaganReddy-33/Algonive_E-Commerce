import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout, cart } = useContext(AppContext);

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">E-Commerce</Link>
      <div className="flex items-center space-x-4">
        {user.token ? (
          <>
            {user.isAdmin && <Link to="/admin">Admin</Link>}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
        <Link to="/cart">Cart ({cart.length})</Link>
      </div>
    </header>
  );
};

export default Header;
