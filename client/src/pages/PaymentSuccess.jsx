import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { FiCheckCircle, FiLoader } from "react-icons/fi";
import { getCurrentUser } from '../services/api';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../constants';
import Footer from '../components/Footer';

function PaymentSuccess() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        const verify = async () => {
            if (!sessionId) {
                setStatus('error');
                return;
            }

            try {
                // First try to verify and add credits
                await axios.post(`${serverUrl}/api/credit/verify-payment`, 
                    { sessionId }, 
                    { withCredentials: true }
                );
                
                // Then refresh user data in redux
                await getCurrentUser(dispatch);
                setStatus('success');

                const t = setTimeout(() => {
                    navigate("/");
                }, 5000);
                return () => clearTimeout(t);
            } catch (error) {
                console.error("Verification failed:", error);
                setStatus('error');
            }
        };

        verify();
    }, [sessionId, dispatch, navigate]);

    return (
        <div className='min-h-screen flex flex-col items-center justify-center p-4 gap-4'>
            {status === 'verifying' && (
                <>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="text-indigo-500 text-6xl">
                        <FiLoader />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-gray-700">Verifying Payment...</h1>
                </>
            )}

            {status === 'success' && (
                <>
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-green-500 text-6xl">
                        <FiCheckCircle />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold text-green-600">
                        Payment Successful! Credits Added
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-gray-500 text-sm">
                        Redirecting to home...
                    </motion.p>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="text-red-500 text-6xl">❌</div>
                    <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
                    <p className="text-gray-500 text-sm">Please contact support if your credits are not updated.</p>
                    <button 
                        onClick={() => navigate("/")}
                        className="mt-4 px-6 py-2 bg-black text-white rounded-lg">
                        Back to Home
                    </button>
                </>
            )}
            <Footer/>
        </div>
    )
}

export default PaymentSuccess
