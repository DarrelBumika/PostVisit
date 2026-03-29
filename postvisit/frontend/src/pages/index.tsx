import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Medical Visit Assistant
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Get clarity on your healthcare visit. Understand your diagnosis,
          medications, and care instructions.
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            How it works:
          </h2>
          <ol className="text-left space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white mr-3">
                1
              </span>
              <span>Your doctor gives you a unique link after your visit</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white mr-3">
                2
              </span>
              <span>Click the link to see your diagnosis and medications</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white mr-3">
                3
              </span>
              <span>Ask questions and get explanations in simple language</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white mr-3">
                4
              </span>
              <span>Access your visit information anytime</span>
            </li>
          </ol>
        </div>
        <p className="text-gray-600 mb-4">
          If you have a visit link, click the button below to get started.
        </p>
        <Link href="/visit/demo">
          <a className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold">
            View Sample Visit
          </a>
        </Link>
        <p className="text-sm text-gray-500 mt-8">
          For healthcare providers: Check your visit link format with your
          puskesmas administrator.
        </p>
      </div>
    </div>
  );
}
