"use client";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import Image from "next/image";
import DetailsHeader from "./DetailsHeader";
import { logo } from "../../../public";
import AdminInfo from "./AdminInfo";
import {
  CalendarDaysIcon,
  EllipsisVertical,
  GaugeIcon,
  WalletIcon,
} from "lucide-react";
import { useStore } from "@/stores/store";
import AnnSettingCard from "./AnnSettingCard";
import RichTextDisplay from "../layout/RichTextDisplay";

export function AnnouncementDetails({
  data,
  toggle,
  setToggle,
}) {
  const dateTime = new Date(data.created_at);
  const date = dateTime.toDateString();
  const time = dateTime.toLocaleTimeString();
  const userData = useStore((state) => state.userData);
  return (
    <Card className="shadow-md">
      <DetailsHeader group_id={data.group} date={date} />
      <div className="px-4">
        {data?.image && (
          <Image
            alt={data?.title || "Announcement Image"}
            className="aspect-[4/3] w-full rounded-t-lg object-cover"
            height="240"
            src={data?.image}
            width="400"
          />
        )}
        {!data?.image && (
          <Image
            alt={data?.title || "Announcement Image"}
            className="aspect-[4/3] w-full rounded-t-lg object-cover"
            height="240"
            src={logo}
            width="400"
          />
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-center relative">
          <CardTitle className="text-md md:text-xl lg:text-2xl xl:text-3xl text-gray-800 capitalize">
            {data?.title}
          </CardTitle>
          {userData?.id === data?.user && (
            <button
              className="p-1  text-white bg-purple-700 shadow-md shadow-gray-700  rounded-full hover:bg-purple-900"
              onClick={() => setToggle((prev) => !prev)}
            >
              <EllipsisVertical size={24} />
            </button>
          )}
          {/* Announcement Edit toggle */}
          {toggle && (
            <div
              className={`absolute z-40 bottom-14 right-0  md:-right-96 bg-white shadow-md shadow-gray-600 p-4 rounded-lg w-88 }`}
            >
              <AnnSettingCard
                setToggle={setToggle}
              />
            </div>
          )}
        </div>
        <AdminInfo admin_id={data?.user} />
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 ">
          <RichTextDisplay html={data?.description} />
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start  sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <CalendarDaysIcon className="h-4 w-4 text-purple-800" />
          <span>Created on {date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 mt-2 md:mt-0">
          <WalletIcon className="h-4 w-4 text-purple-800" />
          <span>Paid</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 mt-2 md:mt-0">
          <GaugeIcon className="h-4 w-4 text-purple-800" />
          <span>Status: {data.status}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
