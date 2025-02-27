import { Link } from "react-router-dom";
import ChorelyLogo from "./Chorely.png";

export default function Header({ darkMode, setDarkMode }) {
    return (
        <header className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <nav className="navbar bg-blue-600 text-white flex justify-between items-center p-4">
                <Link to="/">
                    <img src={ChorelyLogo} alt="Chorely Logo" className="navbar-logo h-16" />
                </Link>
                <div className="flex items-center gap-6">
                    {/* Dark Mode Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={darkMode} 
                            onChange={() => setDarkMode(!darkMode)} 
                            className="hidden"
                        />
                        <div className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                        <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
                    </label>
                    
                    {/* Navigation Links */}
                    <div className="navbar-links flex gap-6 items-center">
                        <Link to="/" className="hover:underline">HOMEPAGE</Link>
                        <Link to="/profile" className="hover:underline">PROFILE</Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
