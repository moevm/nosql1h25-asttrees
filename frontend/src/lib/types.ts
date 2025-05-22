import {Eye, EyeOff, Shield} from "lucide-react";

export const visibilityOptions = [
    {value: "public", label: "Публичный", description: "Любой человек", icon: Eye},
    {value: "protected", label: "Защищенный", description: "Авторизованные пользователи", icon: Shield},
    {value: "private", label: "Приватный", description: "Только я", icon: EyeOff},
];