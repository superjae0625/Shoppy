import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts as fetchProducts, addNewProduct } from "../api/firebase";

//Custom Hooks

export default function useProducts() {
    const queryClient = useQueryClient();

    //데이터를 get 하기 위한 api
    const productsQuery = useQuery(["products"], fetchProducts, {
        staleTime: 1000 * 60,
    });

    //값을 바꿀때 사용하는 api
    //Unlike queries, mutations are typically used to
    //create/update/delete data or perform server side-effects.
    const addProduct = useMutation(
        ({ product, url }) => addNewProduct(product, url),
        {
            //invalidate cache (that has key as "products")
            onSuccess: () => queryClient.invalidateQueries(["products"]),
        }
    );

    return { productsQuery, addProduct };
}
