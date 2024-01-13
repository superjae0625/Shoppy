import React from "react";
import { useNavigate } from "react-router";

export default function ProductCard({
    //bring product itself
    product,
    //bring product items separatly
    product: { id, image, title, category, price },
}) {
    const navigate = useNavigate();
    return (
        <li
            className="rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:scale-105"
            onClick={() => {
                navigate(`/products/${id}`, { state: { product } });
                //optional state value to store in history state,
                //which you can then access on the destination route via useLocation
            }}
        >
            <img className="w-full" src={image} alt={title} />
            <div className="mt-2 px-2 text-lg flex justify-between items-center">
                <h3 className="truncate">{title}</h3>
                <p>{`$${price}`}</p>
            </div>
            <p className="mb-2 px-2 text-gray-600">{category}</p>
        </li>
    );
}
