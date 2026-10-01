import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
function Dashboard() {

    const navigate = useNavigate();

    const [balance, setBalance] = useState(0);
    const [users, setUsers] = useState<any[]>([]);
    const [filter, setFilter] = useState("");

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [amount, setAmount] = useState("");

    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    async function getBalance() {

        const response = await fetch(
            "http://localhost:3000/api/v1/account/balance",
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        const data = await response.json();

        setBalance(data.balance);
    }

    async function getUsers() {

        const response = await fetch(
            "http://localhost:3000/api/v1/user/bulk?filter=" + filter
        );

        const data = await response.json();

        setUsers(data.users);
    }

    useEffect(function () {
        getBalance();
        // getUsers();
    }, []);

    useEffect(function () {

        getUsers();

    }, [filter]);

    async function sendMoney() {

        if (!selectedUser) {
            return;
        }

        const response = await fetch(
            "http://localhost:3000/api/v1/account/transfer",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },

                body: JSON.stringify({
                    to: selectedUser._id,
                    amount: Number(amount)
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setMessage(data.message);
            return;
        }

        setMessage("Transfer successful");

        setAmount("");

        setTimeout(function () {
            setSelectedUser(null);
            setMessage("");
            getBalance();
        }, 1000);
    }

    function logout() {

        localStorage.removeItem("token");

        navigate("/signin");
    }

    return (
       
           <div className="min-h-screen bg-slate-100">
            {/* Navbar */}

             <Appbar onLogout={logout} />


            {/* Main content */}

         <div className="max-w-5xl mx-auto px-6 py-8">

               <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
    <h3 className="text-lg font-bold text-slate-800">
        Your Balance
        <span className="ml-3 text-2xl text-green-600">
            ₹{balance.toFixed(2)}
        </span>
    </h3>
</div>


                <h3 className="text-xl font-bold text-slate-800 mb-4">
    Users
</h3>


                {/* Search */}

                <input
                    type="text"
                    placeholder="Search users..."
                    value={filter}
                    onChange={function (e) {
                        setFilter(e.target.value);
                    }}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-green-500"
                />


                {/* Users */}

                <div className="users-list">

                    {users.map(function (user) {

                        return (
                            <div
                                className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-3"
                                key={user._id}
                            >

                                <div className="flex items-center gap-3">

                                  <div className="h-12 w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-lg font-bold">
    {user.firstName?.[0]?.toUpperCase()}
</div>

                                    <div>
                                        <strong>
                                            {user.firstName} {user.lastName}
                                        </strong>

                                        <p>
                                            {user.username}
                                        </p>
                                    </div>

                                </div>


                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                                    onClick={function () {
                                        setSelectedUser(user);
                                    }}
                                >
                                    Send Money
                                </button>

                            </div>
                        );
                    })}

                </div>

            </div>


            {/* Send Money Modal */}

            {selectedUser && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

                <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">

                  <h1 className="text-2xl font-bold text-center mb-6">
    Send Money
</h1>


                   <div className="flex items-center gap-3 mb-6">

                            <div className="h-12 w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-lg font-bold">
                                {selectedUser.firstName?.[0]?.toUpperCase()}
                            </div>

                            <h2>
                                {selectedUser.firstName}{" "}
                                {selectedUser.lastName}
                            </h2>

                        </div>


                        <label>
                            Amount (in Rs)
                        </label>

                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={function (e) {
                                setAmount(e.target.value);
                            }}
                        />


                        {message && (
                            <p className="message">
                                {message}
                            </p>
                        )}


                        <button
                            className="transfer-button"
                            onClick={sendMoney}
                        >
                            Initiate Transfer
                        </button>


                        <button
                            className="cancel-button"
                            onClick={function () {
                                setSelectedUser(null);
                                setAmount("");
                                setMessage("");
                            }}
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Dashboard;