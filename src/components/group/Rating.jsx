"use client";
import { useStore } from "@/stores/store";
import { set } from "date-fns";
import Cookies from "js-cookie";
import { Star, XIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Rating = ({ rating, user_rated, user_rating }) => {
  const searchParams = useSearchParams();
  const group_id = searchParams.get("group_id");
  const toggleRating = useStore((state) => state.toggleRating);
  const setToggleRating = useStore((state) => state.setToggleRating);
  const userData = useStore((state) => state.userData);
  const userAuthenticated = useStore((state) => state.userAuthenticated);
  const [giveRating, setGiveRating] = useState("");

  const inputRef = useRef(null);
  const access_token = Cookies.get("access_token");

  useEffect(() => {
    if (user_rated){
      setGiveRating(user_rating);
    }

    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [rating,user_rating,user_rated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DB_BASE_URL}/group/give/rating/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          rating: giveRating,
          group: group_id,
          user: userData?.id,
        }),
      }
    );
    if (response.ok) {
      const result = await response.json();
      setToggleRating(false);
      toast.success(result.msg);
    } else {
      const result = await response.json();
      toast.error(result.errors[0].detail);
    }
  };

  const handleClick = async () => {
    if (!userAuthenticated) {
      toast.error("Not logged In!!");
      return;
    }
    setToggleRating(!toggleRating);
  };

  return (
    <div className="relative">
      <div
        title="rating"
        className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400"
        onClick={handleClick}
      >
        <Star className="w-4 h-4 text-gray-500 fill-black dark:text-gray-400" />
        <span>{rating}</span>
      </div>

      {toggleRating && (
        <div className="flex items-center gap-1 rounded-lg bg-white border border-gray-300 dark:border-none dark:shadow-none shadow-md shadow-gray-500 text-sm text-gray-500 dark:text-gray-400 absolute top-0 ">
          <div className="p-3 px-4 relative">
            <p className="flex justify-end items-center absolute right-2 top-2">
              <XIcon
                className="p-1 fill-black text-black cursor-pointer rounded-full bg-white shadow-md shadow-gray-500"
                onClick={() => setToggleRating(!toggleRating)}
              />
            </p>
            <div className="text-xl text-gray-800 font-bold tracking-tighter pb-3">
              Rate Us
              <p className="flex">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < giveRating ? "fill-black" : "text-gray-500"
                    }`}
                  />
                ))}
              </p>
            </div>

            {/* {user_rated !== false && (
              <div className="text-sm text-gray-600 pb-2">
                Your current rating: {user_rating}
              </div>
            )} */}

            <form action="" className="flex gap-4" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="number"
                name="rating"
                id="rating"
                min="1"
                max="5"
                value={giveRating}
                onChange={(e) => setGiveRating(e.target.value)}
                className="outline-none border border-gray-300 text-black rounded-md p-1 justify-between"
              />
              <input
                type="submit"
                value="Submit"
                className="px-3 py-0.5 bg-purple-600 rounded-full text-white font-bold hover:bg-purple-700 text-xs cursor-pointer"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rating;
