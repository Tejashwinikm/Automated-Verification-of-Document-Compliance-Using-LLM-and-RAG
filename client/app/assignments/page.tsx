"use client";

import Link from "next/link";
import { useState } from "react";

type VerificationResult = {
  usn: string;
  studentName: string;
  assignment: string;
  marks: string;
  submissionStatus: string;
  submissionTime: string;
  expectedTime: string;
  result: "Verified" | "Late" | "Missing" | "Mismatch";
};

export default function AssignmentVerification() {
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);

  const [assignmentName, setAssignmentName] =
    useState("Assignment 1");

  const [deadline, setDeadline] =
    useState("2026-09-15T23:59");

  const [verifying, setVerifying] = useState(false);

  const [results, setResults] = useState<VerificationResult[]>([]);

  // --------------------------------------------------
  // Verify Assignment Records
  // --------------------------------------------------

  const verifyAssignments = async () => {
    if (!assignmentFile) {
      alert("Please upload the assignment records.");
      return;
    }

    if (!submissionFile) {
      alert("Please upload the submission/timestamp records.");
      return;
    }

    setVerifying(true);

    try {
      /*
       * Later this will connect to your FastAPI backend.
       *
       * Example:
       *
       * POST http://127.0.0.1:8000/assignment/verify
       */

      const formData = new FormData();

      formData.append("assignment_file", assignmentFile);
      formData.append("submission_file", submissionFile);
      formData.append("assignment_name", assignmentName);
      formData.append("deadline", deadline);

      const response = await fetch(
        "http://127.0.0.1:8000/assignment/verify",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      const data = await response.json();

      setResults(data.results || []);

    } catch (error) {
      console.error(error);

      /*
       * Temporary sample results.
       *
       * Remove this section once the backend
       * endpoint is implemented.
       */

      setResults([
        {
          usn: "22CSE001",
          studentName: "Student A",
          assignment: assignmentName,
          marks: "18/20",
          submissionStatus: "Submitted",
          submissionTime: "2026-09-12 10:30",
          expectedTime: deadline.replace("T", " "),
          result: "Verified",
        },
        {
          usn: "22CSE002",
          studentName: "Student B",
          assignment: assignmentName,
          marks: "19/20",
          submissionStatus: "Missing",
          submissionTime: "-",
          expectedTime: deadline.replace("T", " "),
          result: "Missing",
        },
        {
          usn: "22CSE003",
          studentName: "Student C",
          assignment: assignmentName,
          marks: "15/20",
          submissionStatus: "Submitted",
          submissionTime: "2026-09-16 09:20",
          expectedTime: deadline.replace("T", " "),
          result: "Late",
        },
        {
          usn: "22CSE004",
          studentName: "Student D",
          assignment: assignmentName,
          marks: "20/20",
          submissionStatus: "Submitted",
          submissionTime: "2026-09-10 14:20",
          expectedTime: deadline.replace("T", " "),
          result: "Mismatch",
        },
      ]);

      alert(
        "Backend endpoint is not connected yet. Sample verification results are displayed."
      );
    } finally {
      setVerifying(false);
    }
  };

  // --------------------------------------------------
  // Result counts
  // --------------------------------------------------

  const verifiedCount = results.filter(
    (r) => r.result === "Verified"
  ).length;

  const lateCount = results.filter(
    (r) => r.result === "Late"
  ).length;

  const missingCount = results.filter(
    (r) => r.result === "Missing"
  ).length;

  const mismatchCount = results.filter(
    (r) => r.result === "Mismatch"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <div className="bg-white shadow-sm px-8 py-5">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Assignment Verification
            </h1>

            <p className="text-gray-500 mt-1">
              Verify assignment marks against submission records
              and timestamps.
            </p>

          </div>

          <a
            href="/student"
            className="px-5 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700"
          >
            Student Verification
          </a>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="max-w-7xl mx-auto p-8">

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-2xl shadow p-6">

            <p className="text-gray-500">
              Verified
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {verifiedCount}
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow p-6">

            <p className="text-gray-500">
              Late Submission
            </p>

            <p className="text-3xl font-bold text-orange-500 mt-2">
              {lateCount}
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow p-6">

            <p className="text-gray-500">
              Missing Submission
            </p>

            <p className="text-3xl font-bold text-red-500 mt-2">
              {missingCount}
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow p-6">

            <p className="text-gray-500">
              Record Mismatch
            </p>

            <p className="text-3xl font-bold text-purple-600 mt-2">
              {mismatchCount}
            </p>

          </div>

        </div>

        {/* UPLOAD SECTION */}

        <div className="grid grid-cols-2 gap-6 mb-8">

          {/* ASSIGNMENT RECORD */}

          <div className="bg-white rounded-2xl shadow p-7">

            <h2 className="text-xl font-bold text-gray-800">
              Assignment Records
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-5">
              Upload the document containing student assignment
              marks.
            </p>

            <label className="cursor-pointer block border-2 border-dashed border-purple-300 rounded-xl p-8 text-center bg-purple-50 hover:bg-purple-100">

              <p className="text-lg font-semibold">
                📄 Choose Assignment File
              </p>

              <p className="text-sm text-gray-500 mt-2">
                PDF, CSV, XLSX or image
              </p>

              <input
                type="file"
                hidden
                accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setAssignmentFile(e.target.files[0]);
                  }
                }}
              />

            </label>

            {assignmentFile && (
              <div className="mt-4 bg-purple-100 rounded-lg p-3 text-sm">
                📄 {assignmentFile.name}
              </div>
            )}

          </div>


          {/* SUBMISSION RECORD */}

          <div className="bg-white rounded-2xl shadow p-7">

            <h2 className="text-xl font-bold text-gray-800">
              Submission Records
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-5">
              Upload submission details containing timestamps.
            </p>

            <label className="cursor-pointer block border-2 border-dashed border-green-300 rounded-xl p-8 text-center bg-green-50 hover:bg-green-100">

              <p className="text-lg font-semibold">
                🕒 Choose Submission File
              </p>

              <p className="text-sm text-gray-500 mt-2">
                PDF, CSV, XLSX or image
              </p>

              <input
                type="file"
                hidden
                accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setSubmissionFile(e.target.files[0]);
                  }
                }}
              />

            </label>

            {submissionFile && (
              <div className="mt-4 bg-green-100 rounded-lg p-3 text-sm">
                📄 {submissionFile.name}
              </div>
            )}

          </div>

        </div>


        {/* ASSIGNMENT SETTINGS */}

        <div className="bg-white rounded-2xl shadow p-7 mb-8">

          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Assignment Settings
          </h2>

          <div className="grid grid-cols-2 gap-6">

            <div>

              <label className="block text-sm font-semibold mb-2">
                Assignment Name
              </label>

              <input
                value={assignmentName}
                onChange={(e) =>
                  setAssignmentName(e.target.value)
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold mb-2">
                Submission Deadline
              </label>

              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) =>
                  setDeadline(e.target.value)
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              />

            </div>

          </div>

          <button
            onClick={verifyAssignments}
            disabled={
              verifying ||
              !assignmentFile ||
              !submissionFile
            }
            className={`mt-6 px-8 py-3 rounded-xl text-white font-bold ${
              verifying ||
              !assignmentFile ||
              !submissionFile
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >

            {verifying
              ? "Verifying..."
              : "🔍 Verify Assignments"}

          </button>

        </div>


        {/* RESULTS */}

        {results.length > 0 && (

          <div className="bg-white rounded-2xl shadow overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-xl font-bold">
                Assignment Verification Results
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Comparison between assignment records and
                submission information.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left px-5 py-4">
                      USN
                    </th>

                    <th className="text-left px-5 py-4">
                      Student
                    </th>

                    <th className="text-left px-5 py-4">
                      Assignment
                    </th>

                    <th className="text-left px-5 py-4">
                      Marks
                    </th>

                    <th className="text-left px-5 py-4">
                      Submission
                    </th>

                    <th className="text-left px-5 py-4">
                      Timestamp
                    </th>

                    <th className="text-left px-5 py-4">
                      Result
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {results.map((result) => (

                    <tr
                      key={result.usn}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-5 py-4 font-medium">
                        {result.usn}
                      </td>

                      <td className="px-5 py-4">
                        {result.studentName}
                      </td>

                      <td className="px-5 py-4">
                        {result.assignment}
                      </td>

                      <td className="px-5 py-4">
                        {result.marks}
                      </td>

                      <td className="px-5 py-4">
                        {result.submissionStatus}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {result.submissionTime}
                      </td>

                      <td className="px-5 py-4">

                        {result.result === "Verified" && (
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                            ✓ Verified
                          </span>
                        )}

                        {result.result === "Late" && (
                          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
                            ⚠ Late
                          </span>
                        )}

                        {result.result === "Missing" && (
                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                            ✕ Missing
                          </span>
                        )}

                        {result.result === "Mismatch" && (
                          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                            ⚠ Mismatch
                          </span>
                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}