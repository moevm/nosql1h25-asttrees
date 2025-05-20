import {$api, defaultOnErrorHandler} from "@/api";
import {toast} from "sonner";
import {showRepoSettingsDialogAtom} from "@/store/store.ts";
import {useSetAtom} from "jotai/react";

export function useAddRepoMutation() {
    return $api.useMutation('post', '/repositories', {
        onSuccess(data) {
            if (data) {
                toast.success('Репозиторий был успешно добавлен!')
                window.location.reload();
            }
        },
        onError: defaultOnErrorHandler
    })
}

export function useChangeRepoMutation(id: string) {
    const setShowRepoSettingsDialog = useSetAtom(showRepoSettingsDialogAtom);
    return $api.useMutation('patch', `/repositories/${id}`, {
        onSuccess(data) {
            if (data) {
                toast.success('Репозиторий был успешно изменен!')
                window.location.reload();
            }
            setShowRepoSettingsDialog(false);
        },
        onError: defaultOnErrorHandler
    })
}