"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-start justify-start">

      <div className="w-full max-w-md p-6 md:p-8">

        {/* =================================================
            BRAND
        ================================================= */}

        <h1 className="text-4xl font-bold text-purple-700 mb-8">
          VeriQ AI
        </h1>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="space-y-4">

          {/* =================================================
              STUDENT VERIFICATION
          ================================================= */}

          <Link
            href="/student"
            className="flex items-center gap-5 w-full rounded-2xl px-6 py-5 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition duration-200"
          >

            <span className="text-2xl">
              📄
            </span>

            <span className="text-xl font-semibold text-gray-900">
              Student Verification
            </span>

          </Link>


          {/* =================================================
              ASSIGNMENT VERIFICATION
          ================================================= */}

          <Link
            href="/assignments"
            className="flex items-center gap-5 w-full rounded-2xl px-6 py-5 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition duration-200"
          >

            <span className="text-2xl">
              📝
            </span>

            <span className="text-xl font-semibold text-gray-900">
              Assignment Verification
            </span>

          </Link>

        </div>

      </div>

    </div>
  );
}