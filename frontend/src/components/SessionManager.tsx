import {useEffect} from 'react';
import {useAtom, useAtomValue} from 'jotai';
import {useNavigate} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';
import {$authToken, errorMessage} from "@/api";
import {$currentUser, $currentUserQueryOptions} from "@/store/store.ts";
import {toast} from "sonner";

export function SessionManager() {
    const [token, setToken] = useAtom($authToken);
    const currentUserLoadable = useAtomValue($currentUser);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        console.info({
            token,
            currentUserLoadable
        })
        if (token && currentUserLoadable.state === 'hasError') {
            console.error(
                "Session invalid or /users/me fetch failed. Clearing token and redirecting to login.",
                currentUserLoadable.error
            );

            queryClient.removeQueries({queryKey: $currentUserQueryOptions(true).queryKey});
            setToken(null);

            toast.error("Сессия истекла или невалидна. Пожалуйста, зайдите в аккаунт заново", {
                description: errorMessage(currentUserLoadable.error),
            });

            navigate('/auth', {replace: true});
        }
    }, [
        token,
        currentUserLoadable,
        setToken,
        navigate,
        queryClient
    ]);

    return null;
}
