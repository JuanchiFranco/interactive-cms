import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import API from '../../lib/api';
import Loading from '@/components/Loading';

const Quiz = () => {
  const router = useRouter();
  const { id } = router.query;

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]); // { questionId, answer }
  const [submitted, setSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);   // [{ questionId, answer }]
  const [incorrectAnswers, setIncorrectAnswers] = useState([]); // [{ questionId, answer }]

  useEffect(() => {
    if (!id) return;
    API.get(`/quizzes/${id}?populate=questions`)
      .then(res => setQuiz(res.data))
      .catch(err => console.error('Error al cargar el quiz:', err));
  }, [id]);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => {
      const idx = prev.findIndex(a => a.questionId === questionId);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx].answer = answer;
        return copy;
      }
      return [...prev, { questionId, answer }];
    });
  };

  const handleSubmit = async () => {
    if (answers.length !== quiz.questions.length) {
      alert('Por favor, responde todas las preguntas.');
      return;
    }
    try {
      const { data } = await API.post(`/quizzes/${id}`, {
        answers: answers.map(a => ({ questionId: a.questionId, answer: a.answer })),
      });
      setCorrectAnswers(data.data.correctAnswers);
      setIncorrectAnswers(data.data.incorrectAnswers);

      setSubmitted(true);
      alert(`Puntuación: ${data.data.correctAnswers.length} correctas, ${data.data.incorrectAnswers.length} incorrectas.`);
    } catch (err) {
      console.error('Error al enviar respuestas:', err);
    }
  };

  if (!quiz) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      {quiz.questions.length === 0 ? (
        <p>No hay preguntas disponibles.</p>
      ) : (
        <div>
          {quiz.questions.map(question => {
            const userObj = answers.find(a => a.questionId === question.id);
            const userAnswer = userObj?.answer;
            const correctObj = correctAnswers.find(c => c.id === question.id);
          
            const correctAnswer = correctObj?.answer;

            return (
              <div key={question.id} className="mb-4 p-4 border rounded">
                <h2 className="text-xl font-semibold mb-2">{question.question}</h2>
                {question.options.map((option, idx) => {
                  let classes = 'block p-2 rounded mb-1 ';
                  if (submitted) {
                    if (correctObj) {
                      // siempre marcamos la correcta en verde
                      classes += 'bg-green-200';
                    } else if (option === userAnswer) {
                      // si el usuario la escogió y no es la correcta, la pintamos de rojo
                      classes += 'bg-red-200';
                    }
                  }
                  return (
                    <label key={idx} className={classes}>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        onChange={() => handleAnswer(question.id, option)}
                        checked={userAnswer === option}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
            );
          })}

          <div className="flex items-center justify-center">
            <button
              onClick={handleSubmit}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              {submitted ? 'Revisar de nuevo' : 'Enviar Respuestas'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
