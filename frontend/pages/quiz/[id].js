import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import API from '../../lib/api';
import Loading from '@/components/Loading';

const Quiz = () => {
  const router = useRouter();
  const { id } = router.query;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!id) return;
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/quizzes/${id}?populate=questions`);
        setQuiz(res.data);
      } catch (error) {
        console.error('Error al cargar el quiz:', error);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleAnswer = (questionId, answer) => {
    // Actualizamos el estado de las respuestas, en este formato: [{ questionId: questionId, answer: answer }, { questionId: questionId, answer: answer }, etc.]
    setAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (item) => item.questionId === questionId
      );
      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex].answer = answer;
        return updatedAnswers;
      } else {
        return [...prevAnswers, { questionId, answer }];
      }
    });
  };

  const handleSubmit = async () => {
    // Validate answers before submitting
    if (Object.keys(answers).length !== quiz.questions.length) {
      alert('Por favor, responde todas las preguntas.');
      return;
    }

    // hacemos una petición POST a la API para enviar las respuestas
    try {
      const response = await API.post(`/quizzes/${id}`, {
        answers: answers.map((item) => ({
          questionId: item.questionId,
          answer: item.answer,
        })),
      });
      if (!response.data) {
        alert('Error al enviar respuestas. Por favor, inténtalo de nuevo.');
        return;
      }
      let { correctAnswers, incorrectAnswers } = response.data.data;
      // Calculamos la puntuación
      let score = correctAnswers.length;
      let incorrectScore = incorrectAnswers.length;
      // Mostramos la puntuación al usuario en un alert
      alert(`Puntuación: ${score} respuestas correctas y ${incorrectScore} incorrectas.`);
    } catch (error) {
      console.error('Error al enviar respuestas:', error);
    }
  };

  if (!quiz) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      {quiz.questions.length === 0 ? (
        <p>No hay preguntas disponibles.</p>
      ) : (
        // mapeamos las preguntas y opciones
        <div>
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
            <div className="flex items-center justify-center">
                <button
                    onClick={handleSubmit}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Enviar Respuestas
                </button>
            </div>
            
        </div>
      )}
    </div>
  );
};

export default Quiz;