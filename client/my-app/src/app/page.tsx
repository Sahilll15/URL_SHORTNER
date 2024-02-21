"use client";
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUrlChange = (event: any) => {
    setUrl(event.target.value);
  };


  const shortenUrl = async (url: string) => {
    try {

      const response = await axios.post('https://url-shortner-izss.onrender.com/shorten', {
        originalUrl: url
      });

      console.log('response from shoe', response)
      console.log(response.data.data.shortURL)
      setShortenedUrl(response.data.data.shortURL);
      return response;
    } catch (error) {
      console.error(error);
      toast.error('Error occurred');
    }
  }


  const handleSubmit = async (event: any) => {
    event.preventDefault();

    await shortenUrl(url).then((res: any) => {
      setLoading(true);
      if (res.status === 200) {
        setLoading(false);

        toast.success('URL shortened successfully');
      } else {
        setLoading(false);
        toast.error('Error occurred');
      }
    })
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="bg-black text-white text-center pt-10 text-2xl font-bold">URL SHORTENER</h1>
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="border border-gray-800 p-8 rounded-lg">
          <form className="max-w-lg mx-10" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-100">URL</label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={handleUrlChange}
                className="bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
                required
              />
            </div>

            {
              shortenedUrl && (
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-100">Shortened URL</label>
                  <input
                    type="text"
                    id="shortenedUrl"
                    value={'https://url-shortner-izss.onrender.com/' + shortenedUrl}
                    className="bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
              )
            }

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {loading ? 'Loading...' : 'Shorten'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
