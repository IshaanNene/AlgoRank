import { useState, useEffect } from "react";
import { Search, Tag } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import problemsAPI from "../api/problems";

interface ProblemTag {
  id: string;
  name: string;
  count: number;
}

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  acceptanceRate: number;
  solved: boolean;
}

const Problems = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<ProblemTag[]>([]);
  const [showTagsFilter, setShowTagsFilter] = useState(false);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const data = await problemsAPI.getProblems({ difficulty: selectedDifficulty });
      setProblems(data);
      setAvailableTags([
        { id: "1", name: "Array", count: 20 },
        { id: "2", name: "String", count: 15 },
        { id: "3", name: "Graph", count: 10 }
      ]);
    } catch (err) {
      setError("Failed to load problems.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [selectedDifficulty]);

  const handleProblemClick = (id: string) => {
    navigate(`/code-editor/${id}`);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Problems</h1>
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <button
            onClick={() => setShowTagsFilter((prev) => !prev)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Tag className="w-5 h-5 mr-2 inline" /> Tags
          </button>
        </div>
        {showTagsFilter && (
          <div className="mb-4 flex gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.name)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedTags.includes(tag.name)
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {tag.name} ({tag.count})
              </button>
            ))}
          </div>
        )}
        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full bg-gray-800 rounded-md">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Acceptance Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {problems.length > 0 ? (
                  problems.map((problem) => (
                    <tr
                      key={problem.id}
                      className="border-t hover:bg-gray-600 cursor-pointer"
                      onClick={() => handleProblemClick(problem.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{problem.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/code-editor/${problem.id}`} className="text-blue-400 hover:text-blue-600">
                          {problem.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            problem.difficulty === "Easy"
                              ? "bg-green-500/20 text-green-400"
                              : problem.difficulty === "Medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{problem.acceptanceRate}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-white">
                      No problems available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;