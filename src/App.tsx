import React, { useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { Difficulty, QuestionState, fetchQuizQuestions } from "./API";
import {GlobalStyle, Wrapper} from './App.styles'
export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};
const TOTAL_QUESTIONS = 10;

function App() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);
    const newQeustions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );
    // console.log(newQeustions);
    setQuestions(newQeustions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => 
  {
    if (!gameOver){
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) setScore(prev => prev + 1);
      const answerObject : AnswerObject = 
      {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }
      setUserAnswers(prev => [...prev, answerObject]);
    }
    if (number + 1 === TOTAL_QUESTIONS) setGameOver(true);
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    const lastQuestion = nextQuestion === TOTAL_QUESTIONS;
    if (lastQuestion) setGameOver(true);
    else {
      setNumber(nextQuestion);
    }
  };
  return (
    <>
    <GlobalStyle />
    <Wrapper>
      <h1>Quiz Game</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <button className="start" onClick={startTrivia}>
          Start
        </button>
      ) : null}
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <button className="settings" >
          Settings
        </button>
      ) : null}
      {!gameOver && <p className="score">Score: {score}</p>}
      {loading && <p>Loading questions...</p>}
      {!loading && !gameOver && (
        <QuestionCard
          questionNumber={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}
      {!gameOver &&
        !loading &&
        userAnswers.length === number + 1 &&
        number !== TOTAL_QUESTIONS - 1 && (
          <button className="next" onClick={nextQuestion}>Next Question</button>
        )}
        <h3>Created by niceman, 2020</h3>
    </Wrapper>
    </>
  );
}

export default App;
