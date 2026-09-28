import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";

function Signup() {

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSignup() {

        setError("");

        try {

            const response = await fetch(
                "http://localhost:3000/api/v1/user/signup",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: email,
                        firstName: firstName,
                        lastName: lastName,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(data.message);

                return;
            }

            localStorage.setItem(
                "token",
                data.token
            );

            navigate("/dashboard");

        } catch (error) {

            setError("Something went wrong");

        }
    }

    return (

        <div className="bg-slate-300 h-screen flex justify-center">

            <div className="flex flex-col justify-center">

                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">

                    <Heading label="Sign up" />

                    <SubHeading
                        label="Enter your information to create an account"
                    />


                    <InputBox
                        label="First Name"
                        placeholder="John"
                        value={firstName}
                        onChange={function (e) {
                            setFirstName(e.target.value);
                        }}
                    />


                    <InputBox
                        label="Last Name"
                        placeholder="Doe"
                        value={lastName}
                        onChange={function (e) {
                            setLastName(e.target.value);
                        }}
                    />


                    <InputBox
                        label="Email"
                        placeholder="harkirat@gmail.com"
                        type="email"
                        value={email}
                        onChange={function (e) {
                            setEmail(e.target.value);
                        }}
                    />


                    <InputBox
                        label="Password"
                        placeholder="123456"
                        type="password"
                        value={password}
                        onChange={function (e) {
                            setPassword(e.target.value);
                        }}
                    />


                    {error && (
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    )}


                    <div className="pt-4">

                        <Button
                            label="Sign up"
                            onClick={handleSignup}
                        />

                    </div>


                    <BottomWarning
                        label="Already have an account?"
                        buttonText="Sign in"
                        to="/signin"
                    />

                </div>

            </div>

        </div>
    );
}

export default Signup;