import React from 'react'
import OnBoardingForm from '@/components/onBoardingForm'

const OnBoarding  = () => {
  return (
    <div className="flex items-center  justify-center h-screen w-full"> 
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-center">Welcome to GetValidatedFast.com ✅</h1>
        <p className="text-sm text-gray-500 text-center">
          We are a team of experts who are dedicated to helping you get validated fast.
        </p>

        <OnBoardingForm />
        
      </div>
    </div>
    
  )
}

export default OnBoarding;