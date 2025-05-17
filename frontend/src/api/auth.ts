import {$api, $authToken, defaultOnErrorHandler} from "@/api/index.ts";
import {toast} from "sonner";
import {useSetAtom} from "jotai/react";

export function useRegisterMutation() {
    return $api.useMutation('post', '/auth/register', {
        onSuccess() {
            toast.success('Регистрация завершена! Можете перейти к логину')
        },
        onError: defaultOnErrorHandler
    })
}

export function useLoginMutation() {
    const setToken = useSetAtom($authToken)

    return $api.useMutation(
        'post',
        '/auth/login',
        {
            async onSuccess(data) {
                const token = data.token
                console.info('setting token to ' + token)
                setToken(token!)
            },
            onError(error, variables, context) {
                defaultOnErrorHandler(error, variables, context)
                setToken(null)
            }
        }
    )
}

