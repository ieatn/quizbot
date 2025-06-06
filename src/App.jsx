import React, { useState } from 'react';
import questions1 from './questions'; 
// import questions2 from './questions2';

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [activeQuestionSet, setActiveQuestionSet] = useState(1); // 1 for questions1, 2 for questions2

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setSelectedQuestions(getRandomQuestions(5, chapter));
  };

  const getRandomQuestions = (num, chapter) => {
    const questions = activeQuestionSet === 1 ? questions1 : questions2;
    const filteredQuestions = questions.filter(q => q.chapter === chapter);
    const shuffledQuestions = filteredQuestions.sort(() => 0.5 - Math.random());
    return shuffledQuestions.slice(0, num);
  };

  const toggleQuestionSet = () => {
    setActiveQuestionSet(activeQuestionSet === 1 ? 2 : 1);
    setSelectedChapter(null);
    setSelectedQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const handleAnswer = (option) => {
    setSelectedAnswers([...selectedAnswers, option]);
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setSelectedQuestions(getRandomQuestions(5, selectedChapter));
  };

  const renderResults = () => {
    const wrongAnswers = selectedAnswers.filter((answer, index) => answer !== selectedQuestions[index].answer);
    const correctAnswersCount = selectedQuestions.length - wrongAnswers.length;

    return (
      <div>
        <button
          className="bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600 w-full"
          onClick={resetQuiz}
        >
          Reset Quiz
        </button>
        <h2 className="text-lg font-semibold mb-2">Results:</h2>
        <p className="mb-4">You got {correctAnswersCount} right and {wrongAnswers.length} wrong.</p>
        {selectedQuestions.map((question, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold">{question.question}</p>
            <p className={selectedAnswers[index] === question.answer ? "text-green-500" : "text-red-500"}>
              Your answer: {selectedAnswers[index] || "No answer"}
            </p>
            {selectedAnswers[index] !== question.answer && (
              <p className="text-green-500">Correct answer: {question.answer}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Multiple Choice Quiz</h1>
      {/* <button
        className="bg-purple-500 text-white p-2 rounded mb-4 hover:bg-purple-600"
        onClick={toggleQuestionSet}
      >
        Switch to Quiz {activeQuestionSet === 1 ? '2' : '1'}
      </button> */}
      {!selectedChapter ? (
        <div className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-lg font-semibold mb-2">Select a Chapter</h2>
          {[1].map((chapter) => (
            <button
              key={chapter}
              className="bg-blue-500 text-white p-2 rounded mb-2 hover:bg-blue-600 w-full"
              onClick={() => handleChapterSelect(chapter)}
            >
              Chapter {chapter}
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow-md w-80">
          <button
            className="bg-gray-500 text-white p-2 rounded mb-4 hover:bg-gray-600 w-full"
            onClick={() => {
              setSelectedChapter(null);
              setSelectedQuestions([]);
              setCurrentQuestionIndex(0);
              setSelectedAnswers([]);
              setShowResults(false);
            }}
          >
            Back to Table of Contents
          </button>
          {showResults ? (
            renderResults()
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-2">{selectedQuestions[currentQuestionIndex].question}</h2>
              <div className="flex flex-col">
                {selectedQuestions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    className="bg-blue-500 text-white p-2 rounded mb-2 hover:bg-blue-600"
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
