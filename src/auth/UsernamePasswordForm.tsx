import React from "react";
import { useActionState } from "react";

interface UsernamePasswordFormProps {
    onSubmit: (credentials: { username: string; password: string }) => Promise<{ type: string; message: string }>;
}

const UsernamePasswordForm: React.FC<UsernamePasswordFormProps> = ({ onSubmit }) => {
    const [result, submitAction, isPending] = useActionState(
        async (_previousState: any, formData: FormData) => {
            const username = formData.get("username") as string;
            const password = formData.get("password") as string;

            if (!username || !password) {
                return {
                    type: "error",
                    message: "Please fill in your username and password.",
                };
            }

            const submitResult = await onSubmit({ username, password });
            return submitResult;
        },
        null
    );

    return (
        <>
            {result && <p className={`message ${result.type}`}>{result.message}</p>}
            {isPending && <p className="message loading">Loading ...</p>}
            <form action={submitAction}>
                <label>
                    Username:
                    <input type="text" name="username" disabled={isPending} required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" disabled={isPending} required />
                </label>
                <br />
                <button type="submit" disabled={isPending}>Submit</button>
            </form>
        </>
    );
};

export default UsernamePasswordForm;
