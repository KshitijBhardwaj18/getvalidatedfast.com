import React from 'react'
import OnBoardingForm from '@/components/onBoardingForm'

const OnBoarding  = () => {
  return (
    <div className="flex items-center  justify-center h-screen w-full"> 
      <div className="flex flex-col gap-2">
        

        <OnBoardingForm />
        
      </div>
    </div>
    
  )
}

export default OnBoarding;