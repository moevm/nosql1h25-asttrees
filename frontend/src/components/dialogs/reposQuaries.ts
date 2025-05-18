import {$api, defaultOnErrorHandler} from "@/api";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";

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