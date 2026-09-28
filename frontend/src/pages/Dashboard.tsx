import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        getUsers();
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
        <div className="dashboard">

            {/* Navbar */}

            <div className="navbar">

                <h2>Payments App</h2>

                <div className="user-section">
                    <span>Hello, User</span>

                    <button onClick={logout}>
                        Logout
                    </button>
                </div>

            </div>


            {/* Main content */}

            <div className="dashboard-content">

                <h3>
                    Your Balance
                    <span> ₹{balance.toFixed(2)}</span>
                </h3>


                <h3>Users</h3>


                {/* Search */}

                <input
                    type="text"
                    placeholder="Search users..."
                    value={filter}
                    onChange={function (e) {
                        setFilter(e.target.value);
                    }}
                    className="search-input"
                />


                {/* Users */}

                <div className="users-list">

                    {users.map(function (user) {

                        return (
                            <div
                                className="user-row"
                                key={user._id}
                            >

                                <div className="user-info">

                                    <div className="avatar">
                                        {user.firstName[0]}
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
                                    className="send-button"
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

                <div className="modal-overlay">

                    <div className="modal">

                        <h1>Send Money</h1>


                        <div className="recipient">

                            <div className="big-avatar">
                                {selectedUser.firstName[0]}
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