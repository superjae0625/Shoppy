import React, { useState } from "react";
import { addNewProduct } from "../api/firebase";
import { uploadImage } from "../api/uploader";
import Button from "../components/ui/Button";
import useProducts from "../hooks/useProducts";

export default function NewProduct() {
    const [product, setProduct] = useState({});
    const [file, setFile] = useState();
    const [isUploading, setIsUploading] = useState(false);
    const [success, setSuccess] = useState();
    const { addProduct } = useProducts();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        // console.log(e.target);
        if (name === "file") {
            setFile(files && files[0]);
            // console.log(files[0]);
            // console.log(e.target.name);
            // console.log(e.target.value);
            // console.log(e.target.files);
        }
        //overwriting only updating parts
        setProduct((product) => ({ ...product, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //this will disable the submit button and show if it is uploading or not
        setIsUploading(true);
        //Upload product photo to Cloudinary and get URL
        uploadImage(file)
            .then((url) => {
                // console.log(url);

                //Add the new product to Firebase
                addNewProduct(product, url).then(() => {
                    addProduct.mutate(
                        { product, url },
                        {
                            onSuccess: () => {
                                //show message
                                setSuccess("Uploaded Successfully");
                                //remove message after 4 seconds
                                setTimeout(() => {
                                    setSuccess(null);
                                }, 4000);
                            },
                        }
                    );
                });
            })
            .finally(() => setIsUploading(false));
    };

    return (
        <section className="w-full text-center">
            <h2 className="text-2xl font-bold my-4">Upload New Product</h2>
            {success && <p className="my-2">✅ {success}</p>}
            {/* shows image file if there is an image selected*/}
            {file && (
                <img
                    className="w-96 mx-auto mb-2"
                    src={URL.createObjectURL(file)}
                    alt="local file"
                />
            )}
            <form className="flex flex-col px-12" onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="image/*"
                    name="file"
                    required
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="title"
                    value={product.title ?? ""}
                    placeholder="Product Name"
                    required
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="price"
                    value={product.price ?? ""}
                    placeholder="Price"
                    required
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="category"
                    value={product.category ?? ""}
                    placeholder="Category"
                    required
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="description"
                    value={product.description ?? ""}
                    placeholder="Product Description"
                    required
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="options"
                    value={product.options ?? ""}
                    placeholder="Options(use comma(,))"
                    required
                    onChange={handleChange}
                />
                <Button
                    text={isUploading ? "Uploading..." : "Upload Product"}
                    disabled={isUploading}
                />
            </form>
        </section>
    );
}
