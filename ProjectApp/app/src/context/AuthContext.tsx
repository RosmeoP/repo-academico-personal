import { createContext, useState, useEffect, useContext } from "react";
import { UserResponse } from "../Auth/models/auth.model";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
    token: string | null;
    user: UserResponse | null;
    isLoadingSession: boolean;
    saveSession: (token: string, user: UserResponse) => Promise<void>;
    clearSession: () => void;
    updateUserSession: (updateUser: Partial<UserResponse> | any) => Promise<UserResponse>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
        children,
    }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoadingSession, setIsLoadingSession] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            try {
                //SI TENGO TOKEN GUARDADO
                const savedToken = await AsyncStorage.getItem("@auth_token");

                //SI TENGO EL USUARIO GUARDADO
                const savedUser = await AsyncStorage.getItem("@auth_user");

                if (savedToken && savedUser) {
                    const parsedUser = JSON.parse(savedUser);
                    const profileKeyByEmail = parsedUser.email ? `@user_profile_${parsedUser.email.trim().toLowerCase()}` : null;
                    const profileKeyById = parsedUser.id ? `@user_profile_id_${parsedUser.id}` : null;

                    let savedProfileData: any = null;
                    if (profileKeyByEmail) {
                        const raw = await AsyncStorage.getItem(profileKeyByEmail);
                        if (raw) savedProfileData = JSON.parse(raw);
                    }
                    if (!savedProfileData && profileKeyById) {
                        const raw = await AsyncStorage.getItem(profileKeyById);
                        if (raw) savedProfileData = JSON.parse(raw);
                    }

                    const finalUser = savedProfileData
                        ? {
                              ...parsedUser,
                              ...savedProfileData,
                              name: savedProfileData.name || parsedUser.name,
                              lastName: savedProfileData.lastName || parsedUser.lastName,
                              phone: savedProfileData.phone || parsedUser.phone,
                              imagen: savedProfileData.imagen || parsedUser.imagen || "",
                          }
                        : parsedUser;

                    setToken(savedToken);
                    setUser(finalUser);

                    console.log("Sesion restaurada con exito");
                }
            } catch (error) {
                console.log("Error al cargar la sesion", error);
            } finally {
                setIsLoadingSession(false);
            }
        };

        loadSession();
    }, []);

    //GUARDE LA SESION
    const saveSession = async (
        newToken: string,
        newUser: UserResponse
    ) => {
        try {
            await AsyncStorage.setItem("@auth_token", newToken);

            // Verificar si este usuario tiene datos de perfil previamente editados
            const profileKeyByEmail = newUser.email ? `@user_profile_${newUser.email.trim().toLowerCase()}` : null;
            const profileKeyById = newUser.id ? `@user_profile_id_${newUser.id}` : null;

            let savedProfileData: any = null;
            if (profileKeyByEmail) {
                const raw = await AsyncStorage.getItem(profileKeyByEmail);
                if (raw) savedProfileData = JSON.parse(raw);
            }
            if (!savedProfileData && profileKeyById) {
                const raw = await AsyncStorage.getItem(profileKeyById);
                if (raw) savedProfileData = JSON.parse(raw);
            }

            const finalUser: UserResponse = {
                ...newUser,
                ...(savedProfileData || {}),
                name: savedProfileData?.name || newUser.name,
                lastName: savedProfileData?.lastName || (newUser as any).lastname || newUser.lastName,
                phone: savedProfileData?.phone || newUser.phone,
                imagen: savedProfileData?.imagen || (newUser as any).image || newUser.imagen || "",
            };

            await AsyncStorage.setItem("@auth_user", JSON.stringify(finalUser));

            setToken(newToken);
            setUser(finalUser);
        } catch (error) {
            console.log("Error al persistir la data", error);
        }
    };

    //editar la informacion que tiene la sesion
    const updateUserSession = async (updatedUser: Partial<UserResponse> | any): Promise<UserResponse> => {
        try {
            const incoming = updatedUser?.data || updatedUser?.user || updatedUser || {};
            const normalizedLastName =
                incoming.lastName ??
                incoming.lastname ??
                incoming.last_name ??
                user?.lastName ??
                "";

            const normalizedImage =
                incoming.imagen ??
                incoming.image ??
                incoming.avatarUrl ??
                user?.imagen ??
                "";

            const mergedUser: UserResponse = {
                ...(user || ({} as UserResponse)),
                ...incoming,
                id: incoming.id ?? user?.id ?? 0,
                name: incoming.name ?? user?.name ?? "",
                lastName: normalizedLastName,
                phone: incoming.phone ?? user?.phone ?? "",
                email: incoming.email ?? user?.email ?? "",
                imagen: normalizedImage,
                role: incoming.role ?? incoming.roles ?? user?.role ?? [],
                notification_tokens: incoming.notification_tokens ?? user?.notification_tokens ?? null,
            };

            // 1. Guardar la sesión activa del usuario
            await AsyncStorage.setItem("@auth_user", JSON.stringify(mergedUser));

            // 2. Persistir permanentemente el perfil editado por cuenta (persiste incluso al cerrar sesión)
            const profileDataToSave = {
                name: mergedUser.name,
                lastName: mergedUser.lastName,
                phone: mergedUser.phone,
                imagen: mergedUser.imagen,
            };

            if (mergedUser.email) {
                await AsyncStorage.setItem(
                    `@user_profile_${mergedUser.email.trim().toLowerCase()}`,
                    JSON.stringify(profileDataToSave)
                );
            }
            if (mergedUser.id) {
                await AsyncStorage.setItem(
                    `@user_profile_id_${mergedUser.id}`,
                    JSON.stringify(profileDataToSave)
                );
            }

            setUser(mergedUser);
            return mergedUser;
        } catch (error) {
            console.log("Error al actualizar la data en AsyncStorage", error);
            throw error;
        }
    };

    //LIMPIAR SESION
    const clearSession = async () => {
        try {
            await AsyncStorage.removeItem("@auth_token");
            await AsyncStorage.removeItem("@auth_user");

            setToken(null);
            setUser(null);
        } catch (error) {
            console.log("Error al limpiar data", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isLoadingSession,
                saveSession,
                clearSession,
                updateUserSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);