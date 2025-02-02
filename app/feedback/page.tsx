'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Textarea } from '@/components/ui/textarea';
import { IoIosBug } from "react-icons/io";

const FeedbackPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Email:', title);
    console.log('Description:', description);
    // You can use fetch or axios to send the data to your backend or email service
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 md:pt-24">
      <div className='flex flex-col items-center justify-center w-full p-8 space-y-6 sm:w-[500px]'>
        <div className='items-center justify-center w-full hidden sm:flex'>
          <h1 className="text-4xl font-semibold">Rapportera en bug</h1>
          <IoIosBug size={38} className='ml-2' />
        </div>
        <div className='flex items-center justify-center w-full sm:hidden'>
          <h1 className="text-2xl font-semibold">Rapportera en bug</h1>
          <IoIosBug size={28} className='ml-2' />
        </div>
        <p className="text-lg text-gray-600">Din feedback är viktig för oss. Rapportera en bugg eller skicka in en förbättringsförslag.</p>
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Titel</Label>
            <Input
              className="w-full"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="title"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              className="w-full h-[100px]"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
            />
          </div>
          <div className="w-full">
            <Button type="submit" className="w-full" size="lg">
              Skicka
            </Button>
          </div>
        </form>
      </div>
    </div >
  );
};

export default FeedbackPage;