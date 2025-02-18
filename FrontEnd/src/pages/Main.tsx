import { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Target, Users, ChevronRight, Search, Code, Award, TrendingUp } from "lucide-react";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";

const Main = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();

  const features = [
    {
      icon: <Brain className="w-12 h-12 text-indigo-500" />,
      title: "Smart Problem Selection",
      description:
        "AI-powered algorithm suggests problems based on your skill level and learning pace"
    },
    {
      icon: <Target className="w-12 h-12 text-green-500" />,
      title: "Personalized Learning Path",
      description:
        "Custom-tailored roadmap to improve your algorithmic skills systematically"
    },
    {
      icon: <Code className="w-12 h-12 text-purple-500" />,
      title: "Interactive Code Editor",
      description: "Write, run, and debug code in real time with our built-in editor"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-yellow-500" />,
      title: "Progress Tracking",
      description: "Monitor your progress with detailed statistics and achievements"
    }
  ];

  const stats = [
    { number: 250, label: "Problems Solved" },
    { number: 75, label: "Hours Practiced" },
    { number: 50, label: "Challenges Completed" },
    { number: 10, label: "Awards Won" }
  ];

  const popularProblems = [
    { title: "Two Sum", category: "Array", difficulty: "Easy" },
    { title: "Binary Search", category: "Algorithm", difficulty: "Medium" },
    { title: "Graph Traversal", category: "Graph", difficulty: "Hard" },
    { title: "Linked List Cycle", category: "Linked List", difficulty: "Easy" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="container mx-auto px-4 py-20 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 animate-gradient"
          variants={itemVariants}
        >
          Master Coding with AI-Powered Learning
        </motion.h1>
        <motion.p className="text-xl md:text-2xl text-gray-300 mb-12" variants={itemVariants}>
          Join a community of developers and take your skills to the next level.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link
            to={user ? "/problems" : "/signup"}
            className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {user ? "Start Practicing" : "Sign Up Now"}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </motion.div>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
                {stat.number}
              </div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div id="problems" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Popular Problems</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {popularProblems.map((problem, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{problem.title}</h3>
                  <span className="text-sm text-gray-400">{problem.category}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    problem.difficulty === "Easy"
                      ? "bg-green-500/20 text-green-400"
                      : problem.difficulty === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
              <p className="text-gray-300">
                A challenging problem that will test your skills.
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-indigo-600/80 to-blue-500/80 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            Join thousands of developers who are improving their skills every day.
          </p>
          <Link
            to={user ? "/problems" : "/signup"}
            className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {user ? "Start Practicing" : "Sign Up Now"}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Main;