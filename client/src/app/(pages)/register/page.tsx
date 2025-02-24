import Link from "next/link"

const Register = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Register</h2>

                <form className="space-y-4">
                    <div>
                        <label htmlFor="first_name" className="block text-sm font-medium">First Name</label>
                        <input
                            type="text"
                            id="first_name"
                            placeholder="Enter First Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005d87]"
                        />
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block text-sm font-medium">Last Name</label>
                        <input
                            type="text"
                            id="last_name"
                            placeholder="Enter Last Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005d87]"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input
                            type="text"
                            id="email"
                            placeholder="Enter Email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005d87]"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005d87]"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm_password" className="block text-sm font-medium">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password"
                            placeholder="Enter Confirm Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005d87]"
                        />
                    </div>
                    <button type="submit" className="w-full bg-[#005d87] text-white py-2 rounded-md">
                        Register
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button className="text-sm">
                        Already a user? Login <Link className="text-[#005d87] font-semibold hover:underline" href="/login">here</Link>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Register