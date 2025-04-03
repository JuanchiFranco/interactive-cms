import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import API from '../../lib/api';

const Quiz = () => {
  const router = useRouter();
  const { id } = router.query;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!id) return;
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/quizzes/${id}?populate=questions`);
        console.log('Quiz data:', res.data); // Debugging line
        setQuiz(res.data);
      } catch (error) {
        console.error('Error al cargar el quiz:', error);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    // Validate answers before submitting
    if (Object.keys(answers).length !== quiz.questions.length) {
      alert('Por favor, responde todas las preguntas.');
      return;
    }

    // comparamos las respuestas con la respuesta correcta
    const correctAnswers = quiz.questions.map((question) => question.isCorrect);
    const userAnswers = Object.values(answers);
    const score = userAnswers.reduce((acc, answer, index) => {
      return acc + (answer === correctAnswers[index] ? 1 : 0);
    }, 0);

    const totalQuestions = quiz.questions.length;
    const percentage = (score / totalQuestions) * 100;

    alert(`Tu puntuación es ${score} de ${totalQuestions} (${percentage}%)`);
  };

  if (!quiz) return <p>Cargando...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      {quiz.questions.map((question) => (
        <div key={question.id} className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">
            {question.question}
          </h2>
          {question.options.map((option, index) => (
            <label key={index} className="block">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                onChange={() => handleAnswer(question.id, option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Enviar Respuestas
      </button>
    </div>
  );
};

export default Quiz;