
import React, { useState } from 'react';
import { decryptReceipt } from '../utils/encryption';

const Decryptor: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [encryptedInput, setEncryptedInput] = useState('');
  const [decryptedOutput, setDecryptedOutput] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setIsAuthorized(true);
    } else {
      alert("Wrong Password!");
    }
  };

  const handleDecrypt = () => {
    const result = decryptReceipt(encryptedInput);
    setDecryptedOutput(result);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen pt-40 flex justify-center px-4 bg-purple-50">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md text-center h-fit">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-6">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h2 className="text-3xl font-black mb-6">Admin Access</h2>
          <input 
            type="password" 
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl bg-purple-50 border-none outline-none mb-6 text-center font-bold text-xl"
          />
          <button type="submit" className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-lg">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 px-4 bg-purple-50 pb-20">
      <div className="container mx-auto max-w-4xl bg-white rounded-[40px] shadow-2xl p-10">
        <h2 className="text-4xl font-black mb-10 text-purple-900">Receipt Decryptor</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block font-bold text-gray-500 mb-2">Encrypted String</label>
            <textarea 
              rows={5}
              placeholder="Paste encrypted text here..."
              value={encryptedInput}
              onChange={(e) => setEncryptedInput(e.target.value)}
              className="w-full p-6 bg-purple-50 rounded-3xl border-none outline-none font-mono text-sm"
            />
          </div>

          <button 
            onClick={handleDecrypt}
            className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-purple-700 transition-all"
          >
            Decrypt Receipt
          </button>

          {decryptedOutput && (
            <div className="animate-scale-up mt-10">
              <label className="block font-bold text-gray-500 mb-2">Decrypted Content</label>
              <div className="bg-gray-900 text-green-400 p-8 rounded-3xl font-mono whitespace-pre-wrap relative overflow-hidden">
                {decryptedOutput}
                <a 
                  href="https://maps.app.goo.gl/wFuaKvBwv1ArSuis9" 
                  target="_blank"
                  className="mt-6 inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-xl text-sm font-bold no-underline hover:bg-purple-500"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                  Open Delivery Location
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Decryptor;
