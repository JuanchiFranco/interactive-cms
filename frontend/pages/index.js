import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import API from '../lib/api'; // Adjust the import path as necessary

const Home = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await API.get('/quizzes'); // Adjust the endpoint as necessary
                setQuizzes(response.data);
                console.log('Fetched quizzes:', response.data); // Debugging line
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }
    , []);


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Quizzes</h1>
            {loading ? (
                <p>Loading...</p>
            ) : quizzes.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {quizzes.map((quiz) => (
                        <Link key={quiz.id} href={`/quiz/${quiz.documentId}`} className="block">
                            <div className="block p-4 border rounded hover:shadow-lg transition">
                                <h2 className="text-2xl font-semibold">{quiz.title}</h2>
                                <p>{quiz.description}</p>
                            </div>      
                        </Link>
                    ))}

                </div>
            ) : (
                <p>No quizzes available.</p>
            )}
            
        </div>
    );
};

export default Home;