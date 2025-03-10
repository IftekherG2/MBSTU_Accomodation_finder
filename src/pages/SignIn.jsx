import { useState } from 'react';
import ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'; // Change import here
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = formData;
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    };

    const onSubmit = async (e) => {
        try {
            e.preventDefault();
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential.user) {
                navigate('/');
            }
        } catch (error) {
            toast.error('Bad User Credential');
        }
    };

    return (
        <div className='pageContainer'>
            <header>
                <p className="pageHeader">
                    Welcome Back !
                </p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
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
                    <div className="signInBar">
                        <p className="signInText">Sign In</p>
                        <button type="submit" className='signInButton'> <img src={ArrowRightIcon} alt="Arrow Right" fill='#ffffff' width='36px' height='36px' /> </button>
                    </div>
                </form>
                <OAuth />
                <Link to='/sign-up' className='registerLink'>Sign Up Instead</Link>
            </main>

        </div>
    );
};

export default SignIn;
