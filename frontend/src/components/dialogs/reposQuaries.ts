import {$api, defaultOnErrorHandler} from "@/api";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";

export function useAddRepoMutation() {
    const nav = useNavigate();

    return $api.useMutation('post', '/repositories', {
        onSuccess(data) {
            if (data) {
                nav(`/users/${data.owner.id}/repo/${data.repository.id}`);
                toast.success('Репозиторий был успешно добавлен!')
            }
        },
        onError: defaultOnErrorHandler
    })
}