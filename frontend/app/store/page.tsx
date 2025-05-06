'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import toast, { Toaster } from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

const products = [
  { id: 'free', name: '32x32 Pack', price: 0, priceId: null },
  { id: 'basic', name: 'Current + 2 Updates', price: 6, priceId: 'price_xxx' },
  { id: 'premium', name: 'Lifetime Access', price: 22, priceId: 'price_yyy' },
];

const tips = [
  { id: 'tip-2', name: 'Small Tip', price: 2, priceId: 'price_tip_2' },
  { id: 'tip-5', name: 'Medium Tip', price: 5, priceId: 'price_tip_5' },
  { id: 'tip-10', name: 'Large Tip', price: 10, priceId: 'price_tip_10' },
];

export default function Store() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleDragEnd = (event) => {
    const { over } = event;
    if (over && over.id === 'crafting-output') {
      setSelectedProduct(event.active.data.current);
    }
  };

  const handlePurchase = async () => {
    if (!selectedProduct?.priceId) return;

    const stripe = await stripePromise;
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: selectedProduct.priceId }),
    });

    const { sessionId } = await response.json();
    await stripe?.redirectToCheckout({ sessionId });
    toast.success('Purchase successful!'); //Added toast notification
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Crafting Table Store</h1>
        <Toaster /> {/* Added Toaster component */}
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl mb-4">Texture Packs</h2>
              <div className="grid grid-cols-3 gap-4">
                {products.map((product) => (
                  <DraggableItem key={product.id} product={product} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl mb-4">Tip Jar</h2>
              <div className="grid grid-cols-3 gap-4">
                {tips.map((tip) => (
                  <DraggableItem key={tip.id} product={tip} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <DroppableArea product={selectedProduct} />

            {selectedProduct && (
              <button
                onClick={handlePurchase}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 p-3 rounded"
              >
                Purchase {selectedProduct.name} (${selectedProduct.price})
              </button>
            )}
          </div>
        </DndContext>
      </div>
    </div>
  );
}

function DraggableItem({ product }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: product.id,
    data: product,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-zinc-800 p-4 rounded cursor-move"
      style={{ transform: transform?.toString() }}
    >
      <h3 className="font-bold">{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}

function DroppableArea({ product }) {
  const { setNodeRef } = useDroppable({
    id: 'crafting-output',
  });

  return (
    <div
      ref={setNodeRef}
      className="h-32 border-2 border-dashed border-zinc-700 rounded flex items-center justify-center"
    >
      {product ? (
        <div className="text-center">
          <h3 className="font-bold">{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ) : (
        <p className="text-zinc-500">Drag an item here</p>
      )}
    </div>
  );
}