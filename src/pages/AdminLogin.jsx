import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../lib/auth/admin.auth";
import { IconEye, IconEyeOff } from "../assets/svg/Icons";

import platerologo from "../assets/image/platerologo.webp";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // IMPORTANT: treat username as email for Firebase Auth
      await loginAdmin(form.username, form.password);

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 70%, #fbbf24 0%, transparent 50%)",
          }}
        />

        <div className="relative text-center">
          <div className="w-40 h-40 rounded-full bg-amber-400 flex items-center justify-center mx-auto mb-6 shadow-2xl overflow-hidden">
            <img
              src={platerologo}
              alt="Barangay Platero logo"
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">
            Barangay Platero
          </h1>

          <p className="text-blue-300 text-lg mb-8">Biñan City, Laguna</p>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-left">
            {[
              "Resident Management",
              "Business Registry",
              "Complaint System",
              "Certificate Generator",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 bg-blue-800/40 rounded-xl px-4 py-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center flex-shrink-0">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  >
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                </div>
                <span className="text-blue-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 lg:max-w-md flex flex-col items-center justify-center p-8 lg:bg-white/5 lg:backdrop-blur-sm">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex gap-3 mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-400 flex items-center justify-center">
              <img
                src={platerologo}
                alt="Barangay Platero logo"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-white font-bold">Barangay Platero</p>
              <p className="text-blue-300 text-sm">Biñan, Laguna</p>
            </div>
          </div>

          <div className="glass-card p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              Admin Login
            </h2>

            <p className="text-slate-500 text-sm mb-6">
              Sign in to access the management system
            </p>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="label">Username</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="label">Password</label>

                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    className="input-field pr-10"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? (
                      <IconEyeOff size={18} />
                    ) : (
                      <IconEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full py-3 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-5 p-3 bg-blue-50 rounded-xl text-xs text-blue-600">
              <p className="font-semibold mb-1">Authorized Person</p>
              <p>for public officials of Platero</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
