import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Code, BookOpen, MessageSquare, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProblems } from '../context/ProblemsContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Tabs from '../components/Tabs';
import LoadingSpinner from '../components/LoadingSpinner';
import { Problem } from '../types/problem';

const ProblemDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { problems } = useProblems();
  const [activeTab, setActiveTab] = useState('description');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentProblem = problems.find(p => p.id === Number(id));
    if (currentProblem) {
      setProblem(currentProblem);
      setLoading(false);
    }
  }, [id, problems]);

  if (loading) return <LoadingSpinner />;
  if (!problem) return <div>Problem not found</div>;

  const tabs = [
    {
      id: 'description',
      label: 'Description',
      icon: <BookOpen className="w-4 h-4" />,
      content: (
        <div className="prose max-w-none">
          <h1>{problem.title}</h1>
          <div className="flex gap-2 my-4">
            <span className={`px-2 py-1 rounded-full text-sm ${
              problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {problem.difficulty}
            </span>
            <span className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
              {problem.category}
            </span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: problem.description }} />
          
          <h2>Examples:</h2>
          {problem.examples.map((example, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
              <p><strong>Input:</strong> {example.input}</p>
              <p><strong>Output:</strong> {example.output}</p>
              {example.explanation && (
                <p><strong>Explanation:</strong> {example.explanation}</p>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'solutions',
      label: 'Solutions',
      icon: <Code className="w-4 h-4" />,
      content: (
        <div>
          {/* Add solutions content */}
        </div>
      )
    },
    {
      id: 'discussions',
      label: 'Discussions',
      icon: <MessageSquare className="w-4 h-4" />,
      content: (
        <div>
          {/* Add discussions content */}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/problems')}
            icon={<ChevronLeft />}
          >
            Back to Problems
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              icon={<Share2 />}
              onClick={() => {/* Add share functionality */}}
            >
              Share
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(`/editor/${problem.id}`)}
            >
              Solve Problem
            </Button>
          </div>
        </div>

        <Card>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default ProblemDetail;