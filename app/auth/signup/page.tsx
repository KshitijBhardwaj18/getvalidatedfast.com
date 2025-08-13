import SignUpForm from "@/components/signupform";
import CardWrapper from "@/components/cardwrapper";



export default function SignUpPage() {
  
  return (
    <div className="bg-[#f1eefe] h-full flex items-center justify-center">
      <CardWrapper>
        <div>
          <SignUpForm />
        </div>
      </CardWrapper>
    </div>
  );
}
