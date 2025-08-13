import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";

interface FormErrorProps {
    message?:string 
}

const FormSuccess: React.FC<FormErrorProps> = ({message}) => {
    if(!message){
        return;
    }

    return (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
            <FaRegCheckCircle className="h-4 w-4"/>
            <p>{message}</p>
        </div>
    )
}

export default FormSuccess;
