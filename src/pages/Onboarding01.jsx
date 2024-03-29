import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import OnboardingImage from '../images/onboarding-image.jpg';
import OnboardingDecoration from '../images/auth-decoration.png';
import { db } from "../main";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { currentUser, currentUserDocumentIdAtom } from "./Signup";
import { doc, updateDoc } from "firebase/firestore";

export const userTypeAtom = atom(undefined);

function Onboarding01() {
    const navigate = useNavigate();
    const [type, setType] = React.useState("business");
    const currentUserDocumentId = useAtomValue(currentUserDocumentIdAtom);
    const setCurrentType = useSetAtom(userTypeAtom);
    const [user, setCurrentUser] = useAtom(currentUser);

    // const user = JSON.parse(localStorage.getItem('user'));

    const onTypeChange = (e) => {
        setType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userColRef = doc(db, "users", currentUserDocumentId);
        await updateDoc(userColRef, {
            type: type,
        });

        setCurrentUser({...user, type: type})
        // localStorage.setItem("user", JSON.stringify({...user, type: type}));
        setCurrentType(type);
        if(type === "business" || type === "influencer") {
          navigate("/onboarding-02");
        } else {
          navigate("/onboarding-04");
        }
    };

  return (
    <main className="bg-background">

      <div className="relative flex">

        {/* Content */}
        <div className="w-full md:w-1/2">

          <div className="min-h-screen h-full flex flex-col after:flex-1">

            <div className="flex-1">

              {/* Header */}
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link className="block" to="/">
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <defs>
                      <linearGradient x1="28.538%" y1="20.229%" x2="100%" y2="108.156%" id="logo-a">
                        <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%" />
                        <stop stopColor="#A5B4FC" offset="100%" />
                      </linearGradient>
                      <linearGradient x1="88.638%" y1="29.267%" x2="22.42%" y2="100%" id="logo-b">
                        <stop stopColor="#38BDF8" stopOpacity="0" offset="0%" />
                        <stop stopColor="#38BDF8" offset="100%" />
                      </linearGradient>
                    </defs>
                    <rect fill="#6366F1" width="32" height="32" rx="16" />
                    <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z" fill="#4F46E5" />
                    <path d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z" fill="url(#logo-a)" />
                    <path d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z" fill="url(#logo-b)" />
                  </svg>
                </Link>
                <div className="text-sm">
                  Vous avez un compte ? <Link className="font-medium text-pink-500 hover:text-secondary" to="/signin">Se connecter</Link>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-4 pt-12 pb-8">
                <div className="max-w-md mx-auto w-full">
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-secondary" aria-hidden="true"></div>
                    <ul className="relative flex justify-between w-full">
                      <li>
                        <Link className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white" to="/onboarding-01">1</Link>
                      </li>
                      <li>
                        <Link className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-white text-background" to="/onboarding-02">2</Link>
                      </li>
                      <li>
                        <Link className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-white text-background" to="/onboarding-03">3</Link>
                      </li>
                      <li>
                        <Link className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-white text-background" to="/onboarding-04">4</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-8">
              <div className="max-w-md mx-auto">

                <h1 className="text-3xl text-primary font-bold mb-6">Dites-nous quelle est votre situation</h1>
                {/* Form */}
                <form>
                  <div className="space-y-3 mb-8">
                    <label className="relative block cursor-pointer">
                      <input
                        type="radio"
                        name="radio-buttons"
                        className="peer sr-only" 
                        defaultChecked
                        checked={type === "business"}
                        value="business"
                        onChange={onTypeChange}
                      />
                      <div className="flex items-center bg-card text-sm font-medium text-primary p-4 rounded-xl border border-transparent hover:border-pink-500 shadow-sm duration-150 ease-in-out">
                        <svg className="w-6 h-6 shrink-0 fill-current mr-4" viewBox="0 0 24 24">
                          <path className="text-pink-500" d="m12 10.856 9-5-8.514-4.73a1 1 0 0 0-.972 0L3 5.856l9 5Z" />
                          <path className="text-pink-300" d="m11 12.588-9-5V18a1 1 0 0 0 .514.874L11 23.588v-11Z" />
                          <path className="text-pink-200" d="M13 12.588v11l8.486-4.714A1 1 0 0 0 22 18V7.589l-9 4.999Z" />
                        </svg>
                        <span>Je suis une entreprise</span>
                      </div>
                      <div className="absolute inset-0 border-2 border-transparent peer-checked:border-pink-500 rounded-xl pointer-events-none" aria-hidden="true"></div>
                    </label>
                    <label className="relative block cursor-pointer">
                      <input 
                        type="radio" 
                        name="radio-buttons" 
                        className="peer sr-only"
                        checked={type === "influencer"}
                        value="influencer"
                        onChange={onTypeChange}
                      />
                      <div className="flex items-center bg-card text-sm font-medium text-primary p-4 rounded-xl border border-transparent hover:border-pink-500 shadow-sm duration-150 ease-in-out">
                        <svg className="w-6 h-6 shrink-0 fill-current mr-4" viewBox="0 0 24 24">
                          <path className="text-pink-500" d="m12 10.856 9-5-8.514-4.73a1 1 0 0 0-.972 0L3 5.856l9 5Z" />
                          <path className="text-pink-300" d="m11 12.588-9-5V18a1 1 0 0 0 .514.874L11 23.588v-11Z" />
                        </svg>
                        <span>Je suis un influenceur</span>
                      </div>
                      <div className="absolute inset-0 border-2 border-transparent peer-checked:border-pink-500 rounded-xl pointer-events-none" aria-hidden="true"></div>
                    </label>
                    <label className="relative block cursor-pointer">
                      <input 
                        type="radio" 
                        name="radio-buttons" 
                        className="peer sr-only" 
                        checked={type === "user"}
                        value="user"
                        onChange={onTypeChange}
                      />
                      <div className="flex items-center bg-card text-sm font-medium text-primary p-4 rounded-xl border border-transparent hover:border-pink-500 shadow-sm duration-150 ease-in-out">
                        <svg className="w-6 h-6 shrink-0 fill-current mr-4" viewBox="0 0 24 24">
                          <path className="text-pink-500" d="m12 10.856 9-5-8.514-4.73a1 1 0 0 0-.972 0L3 5.856l9 5Z" />
                        </svg>
                        <span>Je suis un utilisateur</span>
                      </div>
                      <div className="absolute inset-0 border-2 border-transparent peer-checked:border-pink-500 rounded-xl pointer-events-none" aria-hidden="true"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <button 
                      className="btn bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full text-white ml-auto" 
                      onClick={(e) => handleSubmit(e)}
                    >
                      Etape suivante -&gt;
                    </button>
                  </div>
                </form>

              </div>
            </div>

          </div>

        </div>

        {/* Image */}
        <div className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2" aria-hidden="true">
          <img className="object-cover object-center w-full h-full" src={OnboardingImage} width="760" height="1024" alt="Onboarding" />
          <img className="absolute top-1/4 left-0 -translate-x-1/2 ml-8 hidden lg:block" src={OnboardingDecoration} width="218" height="224" alt="Authentication decoration" />
        </div>

      </div>

    </main>
  );
}

export default Onboarding01;