import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSignUp = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${ServerUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(res?.data?.user));
      navigate("/")
    } catch (err) {
      console.log(err);
    } finally {
      // ✅ success / fail dono case me loading off
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Sign Up
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSignUp}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition
              ${
                loading
                  ? "bg-teal-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              }`}
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Footer */}
          <div className="flex justify-center gap-1 text-sm">
            <span className="text-gray-500">
              Already have an account?
            </span>
            <Link
              to="/"
              className="text-teal-600 font-medium hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
