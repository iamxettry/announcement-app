import { Suspense } from "react";
import Image from "next/image";
import { auth } from "../../../../public";
import LoginForm from "@/components/layout/LoginForm";
const Login = () => {
  return (
    <div className="p-4 mt-4 min-h-[500px]">
      <div className=" flex justify-center  md:justify-between flex-row-reverse gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
        <div className=" hidden md:flex flex-1 justify-center">
          <Image src={auth} height={400} width={400} priority alt="auth" className="rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default Login;
