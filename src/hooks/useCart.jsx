import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrUpdateToCart, getCart, removeFromCart } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";

export default function useCart() {
    const { uid } = useAuthContext();
    const queryClient = useQueryClient();

    //Only access this API when there is a user ID.
    //enabled를 사용하면 useQuery를 동기적으로 사용
    //enabled에 값을 넣으면 그 값이 true일때 useQuery를 실행

    //CartStatus.jsx
    const cartQuery = useQuery(["carts", uid || ""], () => getCart(uid), {
        enabled: !!uid,
    });

    //ProductDetail.jsx
    //CartItem.jsx
    const addOrUpdateItem = useMutation(
        (product) => addOrUpdateToCart(uid, product),
        {
            onSuccess: () => {
                //Only invalidate logged in user's cart.
                //By "invalidating" a query, we mean marking its data as outdated or stale.
                //Once a query is marked as stale,
                //React Query will automatically refetch it the next time that data is required,
                //ensuring your application's data remains up-to-date.
                queryClient.invalidateQueries(["carts", uid]);
            },
        }
    );

    //CartItem.jsx
    const removeItem = useMutation((id) => removeFromCart(uid, id), {
        onSuccess: () => {
            queryClient.invalidateQueries(["carts", uid]);
        },
    });

    return { cartQuery, addOrUpdateItem, removeItem };
}
