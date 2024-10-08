import React, { useState, useEffect } from 'react'
import { Smile, Frown, Calculator, AlertCircle } from 'lucide-react'

interface Question {
  num1: number
  num2: number
  operator: '+' | '-'
}

function App() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [options, setOptions] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (!gameOver) {
      startNewRound()
    }
  }, [gameOver])

  const startNewRound = () => {
    const num1 = Math.floor(Math.random() * 11) // 0 to 10
    const num2 = Math.floor(Math.random() * 11) // 0 to 10
    const operator = Math.random() < 0.5 ? '+' : '-'

    const [largerNum, smallerNum] = operator === '-' ? [Math.max(num1, num2), Math.min(num1, num2)] : [num1, num2]

    setCurrentQuestion({ num1: largerNum, num2: smallerNum, operator })
    
    const correctAnswer = operator === '+' ? largerNum + smallerNum : largerNum - smallerNum
    const wrongAnswer1 = correctAnswer + Math.floor(Math.random() * 5) + 1
    const wrongAnswer2 = Math.max(0, correctAnswer - Math.floor(Math.random() * 5) - 1)

    setOptions([correctAnswer, wrongAnswer1, wrongAnswer2].sort(() => Math.random() - 0.5))
    setAttempts(0)
  }

  const handleAnswer = (selectedAnswer: number) => {
    if (currentQuestion) {
      const correctAnswer = currentQuestion.operator === '+' 
        ? currentQuestion.num1 + currentQuestion.num2 
        : currentQuestion.num1 - currentQuestion.num2

      if (selectedAnswer === correctAnswer) {
        setScore(score + 1)
        if (score + 1 >= 20) {
          setGameOver(true)
        } else {
          startNewRound()
        }
      } else {
        if (attempts === 0) {
          setAttempts(1)
        } else {
          setGameOver(true)
        }
      }
    }
  }

  const restartGame = () => {
    setScore(0)
    setGameOver(false)
    setAttempts(0)
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4">Spelet är slut!</h1>
        <p className="text-2xl mb-4">Din poäng: {score}</p>
        {score >= 20 ? (
          <Smile className="w-24 h-24 text-green-500 mb-4" />
        ) : (
          <Frown className="w-24 h-24 text-red-500 mb-4" />
        )}
        <button
          onClick={restartGame}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-xl"
        >
          Spela igen
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Mattequiz</h1>
      <p className="text-2xl mb-4">Poäng: {score}</p>
      {currentQuestion && (
        <div className="mb-8 text-4xl font-bold">
          {currentQuestion.num1} {currentQuestion.operator} {currentQuestion.num2} = ?
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-4 px-6 rounded-lg text-3xl flex items-center justify-center"
          >
            {option}
          </button>
        ))}
      </div>
      {attempts === 1 && (
        <div className="mt-4 flex items-center text-red-500">
          <AlertCircle className="w-6 h-6 mr-2" />
          <span className="text-lg">Försök igen! Du har en chans till.</span>
        </div>
      )}
      <Calculator className="mt-8 w-16 h-16 text-blue-500" />
    </div>
  )
}

export default App