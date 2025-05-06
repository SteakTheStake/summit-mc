
'use client';

import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import toast, { Toaster } from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

const products = [
  { id: 'starter', name: 'Starter Kit', price: 5, priceId: 'price_starter', icon: '📦' },
  { id: 'lifetime', name: 'Lifetime Access', price: 25, priceId: 'price_lifetime', icon: '⭐' },
  { id: 'supporter', name: 'Supporter Pack', price: 15, priceId: 'price_supporter', icon: '❤️' },
];

const tipJar = [
  { id: 'tip-2', name: 'Small Tip', price: 2, priceId: 'price_tip_2', icon: '💎' },
  { id: 'tip-5', name: 'Medium Tip', price: 5, priceId: 'price_tip_5', icon: '🌟' },
  { id: 'tip-10', name: 'Large Tip', price: 10, priceId: 'price_tip_10', icon: '🏆' },
];

export default function Store() {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const playSound = (sound: string) => {
  new Audio(`/${sound}.mp3`).play().catch(() => {});
};

const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id.toString().startsWith('slot-')) {
      const product = active.data.current;
      const newProducts = [...selectedProducts];
      const slotIndex = parseInt(over.id.toString().split('-')[1]);
      
      if (newProducts[slotIndex]) {
        playSound('error');
        toast.error('Slot is already occupied!');
        return;
      }
      
      newProducts[slotIndex] = product;
      setSelectedProducts(newProducts);
      setTotalPrice(newProducts.reduce((sum, item) => sum + (item?.price || 0), 0));
      
      playSound('click');
      toast.success('Item added to crafting grid!');
    }
  };

  const handlePurchase = async () => {
    if (totalPrice === 0) {
      toast.error('Add items to the crafting grid first!');
      return;
    }

    const priceIds = selectedProducts
      .filter(product => product?.priceId)
      .map(product => product.priceId);

    if (priceIds.length === 0) return;

    const stripe = await stripePromise;
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceIds }),
    });

    const { sessionId } = await response.json();
    await stripe?.redirectToCheckout({ sessionId });
  };

  const clearGrid = () => {
    setSelectedProducts([]);
    setTotalPrice(0);
    toast.success('Crafting grid cleared!');
  };

  return (
    <div className="min-h-screen bg-[#2C1810] bg-opacity-95 p-8 font-minecraft">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#FFD700] pixelated">Crafting Table Store</h1>
        <Toaster />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Item Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h2 className="text-2xl mb-4 border-b border-zinc-700 pb-2">Store Items</h2>
              <div className="grid grid-cols-1 gap-4">
                {products.map((product) => (
                  <DraggableItem key={product.id} product={product} />
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl mb-4 border-b border-zinc-700 pb-2">Tip Jar</h2>
              <div className="grid grid-cols-1 gap-4">
                {tipJar.map((tip) => (
                  <DraggableItem key={tip.id} product={tip} />
                ))}
              </div>
            </div>
          </div>

          {/* Crafting Grid */}
          <div className="lg:col-span-6">
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
              <div className="bg-zinc-800 p-6 rounded-lg border-2 border-zinc-700">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <CraftingSlot key={i} index={i} product={selectedProducts[i]} />
                  ))}
                </div>
                
                <div className="border-t border-zinc-700 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl">Total: ${totalPrice}</span>
                    <button
                      onClick={clearGrid}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                    >
                      Clear Grid
                    </button>
                  </div>
                  
                  <button
                    onClick={handlePurchase}
                    className="w-full bg-green-600 hover:bg-green-700 p-3 rounded text-xl"
                    disabled={totalPrice === 0}
                  >
                    Craft Purchase (${totalPrice})
                  </button>
                </div>
              </div>
            </DndContext>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
              <h2 className="text-2xl mb-4 border-b border-zinc-700 pb-2">Cart Summary</h2>
              <div className="space-y-2">
                {selectedProducts.filter(Boolean).map((product, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span>{product.icon} {product.name}</span>
                    <span>${product.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DraggableItem({ product }) {
  const handleClick = () => {
    // Animate the click with CSS
    const element = document.createElement('div');
    element.className = 'click-animation';
    element.style.left = event.clientX + 'px';
    element.style.top = event.clientY + 'px';
    document.body.appendChild(element);

    // Remove the animation element after it completes
    setTimeout(() => element.remove(), 500);

    // Play sound
    new Audio('/click.mp3').play().catch(() => {});
  };

  return (
    <div
      onClick={handleClick}
      className="bg-zinc-800 p-4 rounded cursor-pointer border-2 border-zinc-700 hover:border-zinc-500 transition-colors select-none"
    >
      <div className="flex items-center gap-2 pointer-events-none">
        <span className="text-2xl select-none">{product.icon}</span>
        <div>
          <h3 className="font-bold select-none">{product.name}</h3>
          <p className="select-none">${product.price}</p>
        </div>
      </div>
    </div>
  );
}

function CraftingSlot({ index, product }) {
  const { setNodeRef } = useDroppable({
    id: `slot-${index}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-24 border-2 ${product ? 'border-zinc-500' : 'border-dashed border-zinc-700'} 
        rounded flex items-center justify-center bg-zinc-900 transition-colors`}
    >
      {product ? (
        <div className="text-center">
          <div className="text-2xl mb-1">{product.icon}</div>
          <div className="text-sm">${product.price}</div>
        </div>
      ) : (
        <div className="text-zinc-500 text-sm">Empty Slot</div>
      )}
    </div>
  );
}
