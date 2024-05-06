import EditProfileImg from "@/components/profile/EditProfileImg";
import ProfileNav from "@/components/profile/ProfileNav";
import UserName from "@/components/utils/UserName";
import { Edit, Lock } from "lucide-react";
import Link from "next/link";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="p-4">
      <ProfileNav />
      <div className=" max-w-2xl mx-auto">
        <div className="md:flex border border-gray-300 rounded-xl px-4">
          <div className="flex justify-center items-center gap-6 py-4 md:block md:p-2">
            <EditProfileImg />
            <div>
              <UserName />
              <Link
                href="/profile/change-password"
                className="text-sm font-bold flex items-center justify-start gap-2 my-2"
              >
                <Lock size={18} />
                <span>Change password</span>
              </Link>
              <Link
                href="/profile"
                className="text-sm font-bold flex items-center justify-start gap-2 my-2"
              >
                <Edit size={18} />
                <span>upadate Info</span>
              </Link>
            </div>
          </div>
          <div className="flex-1  border-l-2 p-2 border-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default layout;
