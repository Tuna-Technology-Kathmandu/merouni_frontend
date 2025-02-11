"use client";
import withAuth from "@/app/components/withAuth";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { FaUniversity, FaBookOpen, FaCalendarAlt } from "react-icons/fa";


const AdminPage = () => {
  useEffect (() => {
    document.title = "MeroUni Admin Dashboard";
  }, []);
  return (
    <div className="container mx-auto p-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to MeroUni Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Empowering students with the tools and resources to unlock their educational potential in Nepal.
        </p>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg p-8 mb-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">About MeroUni</h2>
        <p className="text-gray-700 leading-relaxed">
          MeroUni is Nepal&apos;s premier educational platform, dedicated to bridging the gap between students and their dream institutions. We offer a comprehensive database of colleges, universities, degree programs, and entrance exam details, ensuring students have all the information they need to make informed decisions about their future.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Feature 1: Find Colleges */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center">
          <div className="flex justify-center mb-4">
            <FaUniversity className="text-4xl text-blue-600" />
          </div>
          <h3 className="font-semibold mb-4 text-xl text-blue-600">Discover Institutions</h3>
          <p className="text-gray-600">
            Explore the best colleges and universities in Nepal, tailored to your academic goals.
          </p>
        </div>

        {/* Feature 2: Entrance Exams */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center">
          <div className="flex justify-center mb-4">
            <FaCalendarAlt className="text-4xl text-purple-600" />
          </div>
          <h3 className="font-semibold mb-4 text-xl text-purple-600">Entrance Exam Updates</h3>
          <p className="text-gray-600">
            Stay ahead with the latest information on upcoming entrance exams and deadlines.
          </p>
        </div>

        {/* Feature 3: Degree Programs */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center">
          <div className="flex justify-center mb-4">
            <FaBookOpen className="text-4xl text-blue-600" />
          </div>
          <h3 className="font-semibold mb-4 text-xl text-blue-600">Explore Programs</h3>
          <p className="text-gray-600">
            Find the perfect degree program to match your interests and career aspirations.
          </p>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 text-center"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ready to Take the Next Step?</h2>
        <p className="text-gray-600 mb-6">
          Join thousands of students who have found their path with MeroUni. Start your journey today!
        </p>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
          Get Started
        </button>
      </motion.div>
    </div>
  );
};

export default withAuth(AdminPage);