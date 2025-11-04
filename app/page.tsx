'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ITEMS } from '@/data/items';

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, watch } = useForm();
  const selected = watch('items') || [];

  const total = selected.reduce((sum, id) => {
    const item = ITEMS.find(i => i.id === id);
    return sum + (item?.price || 0);
  }, 0);

  const onSubmit = async (data) => {
    await fetch('/api/send', {
      method: 'POST',
      body: JSON.stringify({ ...data, items: selected, total }),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-10 rounded shadow text-center">
          <h1 className="text-2xl font-bold text-green-700">Order Sent!</h1>
          <p>We will contact you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center mb-6">Place Your Order</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <input {...register('name', { required: true })} placeholder="Your Name *" className="w-full p-3 border rounded" required />
          <input {...register('email', { required: true })} type="email" placeholder="Email *" className="w-full p-3 border rounded" required />
          <input {...register('phone')} placeholder="Phone (optional)" className="w-full p-3 border rounded" />

          <div className="space-y-2">
            <p className="font-medium">Choose Items:</p>
            {ITEMS.map(item => (
              <label key={item.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <input type="checkbox" value={item.id} {...register('items')} className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold">${(item.price / 100).toFixed(2)}</span>
              </label>
            ))}
          </div>

          {selected.length > 0 && (
            <div className="bg-blue-50 p-3 rounded font-bold text-right">
              Total: ${(total / 100).toFixed(2)}
            </div>
          )}

          <textarea {...register('notes')} placeholder="Notes (optional)" rows={3} className="w-full p-3 border rounded" />

          <button
            type="submit"
            disabled={selected.length === 0}
            className="w-full py-3 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 disabled:opacity-50"
          >
            Send Order
          </button>
        </form>
      </div>
    </div>
  );
}
