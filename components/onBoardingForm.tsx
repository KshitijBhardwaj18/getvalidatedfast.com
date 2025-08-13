import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

const onBoardingForm = () => {
  return (
    <div className="flex flex-col gap-2">
        <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 border-none"> 
            <CardHeader className="flex flex-col gap-2 border-none">
                <CardTitle className='w-full'>
                    <h1 className="text-2xl font-bold text-center">
                        Create Your Workspace
                    </h1>
                </CardTitle>
                <CardDescription>
                    <p className="text-sm text-gray-500 text-center">
                        Create a workspace to collaborate with your team and organize your projects.
                    </p>
                </CardDescription>
            </CardHeader>

        </Card>
    </div>
  )
}

export default onBoardingForm