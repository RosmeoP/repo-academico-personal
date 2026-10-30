import { AuthResponse } from "../models/auth.model";
import axios, { isAxiosError } from "axios";
import { API_URL } from "@/api/apiClient";

export const AuthService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            return response.data;
        } catch (error: any) {
            console.log("ERROR LOGIN COMPLETO:", error);
            if (isAxiosError(error) && error.response) {
                console.log("ERROR RESPONSE:", error.response.data);
                throw new Error(error.response.data?.Message || error.response.data?.message || "Error to login");
            }
            throw new Error("Server error");
        }
    },
    register: async (
        name: string,
        lastname: string,
        phone: string,
        email: string,
        password: string
    ) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name,
                lastname,
                phone,
                email,
                password
            });
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.Message || error.response.data?.message || "Error to register");
            }
            throw new Error("Server error");
        }
    },
    updateUser: async (
        userId: number | string,
        name: string,
        lastname: string,
        phone: string,
        token: string,
        imagen?: string,
    ): Promise<any> => {
        console.log("TOKEN", token);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("lastname", lastname);
            formData.append("phone", phone);
            if (imagen) {
                formData.append("imagen", imagen);
                formData.append("image", imagen);
            }

            const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

            const response = await axios.put(`${API_URL}/users/${userId}`, formData, {
                headers: {
                    Authorization: authTokenHeader,
                    "Content-Type": "multipart/form-data"
                },
            });
            return response.data;
        } catch (error: any) {
            console.log("ERROR UPDATE USER:", error);
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.message || error.response.data?.Message || "Error to update user");
            }
            throw new Error("Server error");
        }
    }
};