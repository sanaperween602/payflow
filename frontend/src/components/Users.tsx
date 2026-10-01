// src/components/Users.tsx

import { Button } from "./Button";

type UserType = {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
};

type UserProps = {
    user: UserType;
};

export function Users() {
    // Your users state, search input,
    // and backend API logic go here.

    return (
        <div>
            {/* Your users.map() goes here */}
        </div>
    );
}

function User({ user }: UserProps) {
    return (
        <div className="flex justify-between">
            <div>
                {user.firstName} {user.lastName}
            </div>

            <Button label="Send Money" onClick={() => {}} />
        </div>
    );
}