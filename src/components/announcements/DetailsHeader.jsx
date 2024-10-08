"use client";
import Cookies from "js-cookie";
import { CalendarDaysIcon, Users2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

const DetailsHeader = ({ date, group_id }) => {
    const [groupInfo, setGroupInfo] = useState({})
  const access_token = Cookies.get("access_token");

  useEffect(() => {
    if (!group_id) {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DB_BASE_URL}/group/retrieve/${group_id}/
            `,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        if (!response.ok) {
          console.log("something went wrong");
          return;
        }
        const result = await response.json();
        setGroupInfo(result);
      } catch (error) {
        console.log("something went wrong");
      }
    };

    fetchData();
  }, [access_token, group_id]);

  return (
    <div className="bg-purple-100  px-4 py-4 rounded-t-lg ">
      <div className="">
        <div className="flex items-center gap-3 text-2xl font-medium text-gray-700">
          <Users2Icon className="h-5 w-5 text-purple-800" />
          <span className="font-semibold text-black">{groupInfo.name}</span>
        </div>
        <div className=" items-center gap-2 text-sm text-gray-500  hidden ">
          <CalendarDaysIcon className="h-4 w-4" />
          <span className="text-nowrap">{date} </span>
        </div>
      </div>
    </div>
  );
};

export default DetailsHeader;
