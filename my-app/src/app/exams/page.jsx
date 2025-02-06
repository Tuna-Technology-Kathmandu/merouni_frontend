"use client";
import { useEffect, useState } from "react";
import { getExams } from "./actions";
import Header from "../components/Frontpage/Header";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await getExams();
        setExams(response.items);
        setLoading(false);
      } catch (err) {
        setError("Failed to load exams");
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (

    <>
      <Header />
      <Navbar />

    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Entrance Exams</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{exam.title}</h2>
              <p className="text-gray-600 mb-4">{exam.description}</p>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Syllabus:</span>
                  <span>{exam.syllabus}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Created:</span>
                  <span>{new Date(exam.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <a
                href={exam.pastQuestion}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
              >
                View Past Questions
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
}
