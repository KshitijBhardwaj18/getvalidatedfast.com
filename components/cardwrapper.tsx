import React from 'react'
import {Card, CardHeader, CardTitle, CardDescription, CardContent, } from "@/components/ui/card";

type CardWrapperProps = {
    children: React.ReactNode; // Accepts any valid React node
  };
const CardWrapper: React.FC<CardWrapperProps> = ({children}) => {

    return (
       <Card className="bg-white p-5 border-none">
            <CardHeader>
                <CardTitle className="text-black text-center">
                    ✅ GetValidatedFast.com
                </CardTitle>
                <CardDescription >
                    One stop shop for all your validation needs.
                 </CardDescription>   
            </CardHeader>

            <CardContent>
                {children}
            </CardContent>

       </Card>
    )
}

export default CardWrapper;