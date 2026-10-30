import { AuthService } from "@/app/src/Auth/services/auth.service";
import { useAuth } from "@/app/src/context/AuthContext";
import { useState } from "react";

export function useLogin() {
    const { saveSession } = useAuth();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorsMessage] = useState<string | null>(null)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev)
    }

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorsMessage("Please, complete all fields")
            return
        }

        setErrorsMessage(null)
        setIsLoading(true)

        try {
            const data = await AuthService.login(email, password)
            console.log("TOKEN Bearer", data.token);
            await saveSession(data.token, data.userResponse)
        } catch (error: any) {
            setErrorsMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        email,
        password,
        setEmail,
        setPassword,
        isLoading,
        errorMessage,
        isPasswordVisible,
        togglePasswordVisibility,
        handleLogin,
    }
}
