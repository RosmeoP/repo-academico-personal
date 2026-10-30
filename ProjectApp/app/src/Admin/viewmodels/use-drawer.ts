import { useAuth } from "@/app/src/context/AuthContext";
import { useMemo } from "react";
import { AdminProfile, DrawerItemOption } from "../Models/drawer.model";

export function useDrawer() {
    const { user } = useAuth();

    const profile: AdminProfile = useMemo(() => {
        const fullName = [user?.name, user?.lastName].filter(Boolean).join(" ").trim() || "Usuario";
        const role =
            user?.role && user.role.length > 0
                ? user.role.map((r) => r.name).join(", ")
                : user?.email || "Usuario";
        const avatarUrl =
            user?.imagen && user.imagen.trim().length > 0
                ? user.imagen.trim()
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=005C3A&color=fff&size=200`;

        return {
            name: fullName,
            role,
            avatarUrl,
            version: "v1.0.0",
        };
    }, [user]);

    const navigationOptions: DrawerItemOption[] = [
        { name: "dashboard", label: "Dashboard", icon: "grid" },
        { name: "orders", label: "Orders", icon: "package" },
        {
            name: "inventory-group",
            label: "Inventory",
            icon: "archive",
            subitems: [
                { name: "inventory", label: "Categories", icon: "folder" },
                { name: "create-product", label: "Products", icon: "file-text" },
            ],
        },
    ];

    return {
        profile,
        navigationOptions,
    };
}
