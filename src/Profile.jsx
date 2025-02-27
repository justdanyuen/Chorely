import PlaceholderProfile from "./PlaceholderProfile.jpg";

export default function Profile() {
    return (
        <section className="content profile-section p-6 bg-gray-100 min-h-screen flex flex-col items-center">
            {/* Title */}
            <h1 className="text-2xl text-black-700 sm:text-3xl font-bold text-center">User Profile</h1>

            {/* Profile Card */}
            <div className="profile-card bg-white shadow-lg rounded-lg p-6 mt-6 flex flex-col sm:flex-row items-center w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                {/* Profile Image (Left Side on Desktop) */}
                <img 
                    src={PlaceholderProfile} 
                    alt="Profile Picture" 
                    className="profile-pic rounded-full mb-4 sm:mb-0 sm:mr-6 border-4 border-gray-300" 
                    style={{ width: "128px", height: "128px", objectFit: "cover" }} 
                />

                {/* User Details (Right Side on Desktop) */}
                <div className="profile-info text-center sm:text-left">
                    <p className="text-gray-700 text-lg sm:text-xl font-semibold">John Doe</p>
                    <p className="text-gray-700 text-lg sm:text-xl">@johndoe123</p>
                    <p className="text-gray-700 text-lg sm:text-xl">Email: johndoe@example.com</p>
                    <p className="text-gray-700 text-lg sm:text-xl">Phone: +1 (555) 123-4567</p>
                    <p className="text-gray-700 text-lg sm:text-xl">Location: San Luis Obispo, CA</p>
                    <p className="text-gray-700 text-lg sm:text-xl">Member since: January 2023</p>
                    <p className="text-gray-700 text-lg sm:text-xl">Account Type: Premium</p>
                </div>
            </div>
        </section>
    );
}
