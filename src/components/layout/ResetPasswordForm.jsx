"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useStore } from "@/stores/store";
const ResetPasswordFrom = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const verifyFor = searchParams.get("verifyFor");

  const [password, setPassword] = useState("");
  const [confirmPssword, setconfirmPssword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const setUserLoggedIn = useStore((state) => state.setUserLoggedIn);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");

    if (!password || !confirmPssword) {
      setErrorMsg("Password is Missing!!");
      return;
    }
    if (password !== confirmPssword) {
      setErrorMsg("Password and Confirm password is not matching!!");
      return;
    }

    const url=verifyFor === "forgot-password" ? "forgot/password" : "password";

    const newPromise = new Promise(async (resolve, reject) => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/user/change/${url}/`,
        {
          method: "POST",
          body: JSON.stringify({ username, new_password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();

        Cookies.set("access_token", result.access, { expires: 7 });
        Cookies.set("refresh_token", result.refresh), { expires: 7 };
        setUserLoggedIn(true);
        router.push("/");

        resolve(result);
      } else {
        const result = await response.json();
        if (result.errors.length > 0) {
          result.errors.forEach((error) => {
            setErrorMsg(error.detail);
          });
        }
        reject(result);
      }
    });
    toast.promise(newPromise, {
      loading: "Loading...",
      success: (data) => data?.msg,
      error: (data) => data.errors[0].detail,
    });
    setErrorMsg("");
  };

  return (
    <form
      className="  border-2 p-4 rounded-md shadow-md shadow-gray-500 w-[400px]"
      onSubmit={handleSubmit}
    >
      <h1 className="text-4xl font-bold text-center pb-10 text-gray-700">
        Change Password
      </h1>
      {errorMsg && (
        <p className="text-red-500 border border-red-300 px-4 py-2 rounded-xl bg-red-200 mb-4">
          {errorMsg}
        </p>
      )}

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="password"
          name="new_password"
          id="new_password"
          className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
            errorMsg && !password && "focus:border-red-500 border-red-500/55"
          } `}
          placeholder=" "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label
          htmlFor="new_password"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          New Password *
        </label>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="password"
          name="confirm_password"
          id="confirm_password"
          className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
            errorMsg &&
            !confirmPssword &&
            "focus:border-red-500 border-red-500/55"
          } `}
          placeholder=" "
          value={confirmPssword}
          onChange={(e) => setconfirmPssword(e.target.value)}
        />
        <label
          htmlFor="floating_password"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Confirm Password *
        </label>
      </div>

      <div className="flex">
        <button className="bg-blue-700 w-full text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 px-5 py-2.5 rounded-lg">
          Change Password
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordFrom;