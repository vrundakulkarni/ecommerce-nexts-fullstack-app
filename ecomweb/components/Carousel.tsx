"use client";

import Stripe from "stripe";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";  

interface Props {
    products: Stripe.Product[]; 
}

export const Carousel: React.FC<Props> = ({ products }) => {
    const [current, setCurrent] = useState<number>(0);

    useEffect(() => {
        if (!products || products.length === 0) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % products.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [products]); // Fix: Track entire products array

    // Prevent errors if products is undefined
    if (!products || products.length === 0) {
        return <p>Loading products...</p>;
    }

    const currentProduct = products[current];

    // Fix: Ensure default_price is correctly retrieved
    const price = typeof currentProduct.default_price === "object"
        ? (currentProduct.default_price as Stripe.Price)
        : null;

    return (
        <Card className="relative overflow-hidden rounded-lg shadow-md border-gray-300">
            {currentProduct.images?.[0] && (
                <div className="relative h-80 w-full">
                    <Image
                        src={currentProduct.images[0]}
                        alt={currentProduct.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-opacity duration-500 ease-in-out"
                    />
                </div>
            )}
            <CardContent className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                <CardTitle className="text-3xl font-bold text-white mb-2">
                    {currentProduct.name}
                </CardTitle>
                {price?.unit_amount && (
                    <p className="text-xl text-white">
                        ${(price.unit_amount / 100).toFixed(2)}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};
