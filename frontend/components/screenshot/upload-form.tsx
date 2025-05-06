"use client";

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/button';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation'; // Changed to useSearchParams

export const UploadForm = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams(); // Use searchParams instead of router.query
  const username = searchParams.get('username'); // Get username from search params
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !session || !username) {
      toast.error('Please select a file and ensure you are logged in');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('hashtags', hashtags);

    try {
      const res = await fetch(`/api/media/${username}/img`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      
      if (res.ok) {
        toast.success('Screenshot uploaded successfully!');
        setTitle('');
        setDescription('');
        setHashtags('');
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(result.error || 'Failed to upload');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error uploading screenshot');
      console.error('Error uploading screenshot:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-3 rounded bg-zinc-800/50 border border-zinc-700"
          required
        />
        
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-3 rounded bg-zinc-800/50 border border-zinc-700 h-32"
        />

        <input
          type="text"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="Hashtags (comma separated)"
          className="w-full p-3 rounded bg-zinc-800/50 border border-zinc-700"
        />

        <div className="space-y-2">
          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg cursor-pointer bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {preview ? (
                  <Image src={preview} alt="Preview" width={200} height={200} className="object-contain" />
                ) : (
                  <>
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-400">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PNG, JPG, JPEG (MAX. 800x400px)</p>
                  </>
                )}
              </div>
              <input 
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </label>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={uploading}
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 transition-colors"
      >
        {uploading ? 'Uploading...' : 'Upload Screenshot'}
      </Button>
    </form>
  );
};