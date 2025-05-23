import {$api, defaultOnErrorHandler, queryClient} from "@/api";
import {toast} from "sonner";
import {
    $currentRepoViewQuery,
    $currentUserQueryOptions,
    $currentUserReposQueryOptions,
    $showRepoSettingsDialog
} from "@/store/store.ts";
import {useSetAtom} from "jotai/react";

export function useAddRepoMutation(userId: string) {
    return $api.useMutation('post', '/repositories', {
        onSuccess(data) {
            if (data) {
                toast.success('Репозиторий был успешно добавлен!')
                queryClient.invalidateQueries({ queryKey: $currentUserReposQueryOptions(userId, true).queryKey });
            }
        },
        onError: defaultOnErrorHandler
    })
}

export function useChangeRepoMutation(userId: string, id: string) {
    const setShowRepoSettingsDialog = useSetAtom($showRepoSettingsDialog);
    return $api.useMutation('patch', `/repositories/${id}`, {
        onSuccess(data) {
            if (data) {
                toast.success('Репозиторий был успешно изменен!')
                queryClient.invalidateQueries({ queryKey: $currentUserReposQueryOptions(userId, true).queryKey });
            }
            setShowRepoSettingsDialog(false);
        },
        onError: defaultOnErrorHandler
    })
}
