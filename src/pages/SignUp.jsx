import { useState } from 'react';
import ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'; // Change import here
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import OAuth from '../components/OAuth';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const { name, email, password } = formData;
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(auth.currentUser, {
                displayName: name
            });
            const formDataCopy = { ...formData };
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();
            await setDoc(doc(db, 'users', user.uid), formDataCopy);
            navigate('/');
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className='pageContainer'>
            <header>
                <p className="pageHeader">
                    Sign Up Here !
                </p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <input type="text"
                        className="nameInput"
                        placeholder='Name'
                        id='name'
                        value={name}
                        onChange={onChange} />

                    <input type="email"
                        className="emailInput"
                        placeholder='Email'
                        id='email'
                        value={email}
                        onChange={onChange} />

                    <div className="passwordInputDiv">
                        <input
                            type={showPassword ? "text" : "password"}
                            className='passwordInput'
                            placeholder='password'
                            id='password'
                            value={password}
                            onChange={onChange} />
                        <img src={visibilityIcon} alt="Password Show" className='showPassword' onClick={() => setShowPassword((prevState) => !prevState)} />
                    </div>
                    <Link to='/forgot-password' className='forgotPasswordLink'>Forgot Password ? </Link>
                    <div className="signUpBar">
                        <p className="signUpText">Sign Up</p>
                        <button type="submit" className='signUpButton'> <img src={ArrowRightIcon} alt="Arrow Right" fill='#ffffff' width='36px' height='36px' /> </button>
                    </div>
                </form>
                <OAuth />
                <Link to='/sign-in' className='registerLink'>Sign In Instead</Link>

            </main>

        </div>
    );
};

export default SignUp;
