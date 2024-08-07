"use client";
import dynamic from 'next/dynamic';

const CreateGroup = dynamic(() => import("@/components/group/CreateGroup"), { ssr: false });
// import { AnnouncementCardForm } from "@/components/announcements/AnnouncementCardForm";

import PopUpWrapper from "@/components/PopUpWrapper";
import GroupCard from "@/components/profile/dashboard/GroupCard";
import DeleteConfirm from "@/components/utils/DeleteConfirm";
import LeaveConfirm from "@/components/utils/LeaveConfirm";
import { fetchAllData, GetAccessToken } from "../../../../index";
import { useStore } from "@/stores/store";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [switchGroup, setSwitchGroup] = useState(false);
  const [data, setData] = useState(null);
  const [deleteToggle, setDeleteToggle] = useState(false);
  const [leaveGroupToggle, setLeaveToggle] = useState(false);
  const [groupData, SetGroupData] = useState(null);
  const [JoinedGroup, setJoinedGroup] = useState(null);
  const [JoinedFilterdGroup, setJoinedFilterdGroup] = useState(null);
  const access_token = GetAccessToken();
  const toggleCreateGroup = useStore((state) => state.toggleCreateGroup);
  const setToggleCreateGroup = useStore((state) => state.setToggleCreateGroup);
 
  const userData = useStore((state) => state.userData);
  useEffect(() => {
    const fetchGroup = async () => {
      const allData = await fetchAllData(
        `${process.env.NEXT_PUBLIC_DB_BASE_URL}/group/created-by/user/`
      );
      setData(allData);
    };
    fetchGroup();
  }, [deleteToggle]);
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const allData = await fetchAllData(
          `${process.env.NEXT_PUBLIC_DB_BASE_URL}/group/joined-by/user/`
        );
        setJoinedGroup(allData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGroup();
  }, [leaveGroupToggle]);
  useEffect(() => {
    if (JoinedGroup) {
      const filterData = JoinedGroup.filter((group) => {
        return group.admin_id !== userData.id;
      });
      setJoinedFilterdGroup(filterData);
    }
  }, [JoinedGroup, userData.id]);

  const handleDeleteGroup = () => {
    if (groupData === null) return;
    const newPromise = new Promise(async (resolve, reject) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DB_BASE_URL}/group/delete/${groupData?.group_id}/`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.ok) {
        setDeleteToggle(false);
        resolve();
      } else {
        setDeleteToggle(false);
        const result = await response.json();
        reject(result);
      }
    });
    toast.promise(newPromise, {
      loading: "Deleting group...",
      success: "Group deleted successfully!",
      error: (data) => data.errors[0].detail || "Failed to delete group",
    });
  };

  const handleLeaveGroup = () => {
    setLeaveToggle(true);
    const newPromise = new Promise(async (resolve, reject) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DB_BASE_URL}/group/leave/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ group_id: groupData?.group_id }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setLeaveToggle(false);
        resolve(result);
      } else {
        const result = await response.json();
        reject(result);
      }
    });
    toast.promise(newPromise, {
      loading: "Leaving group...",
      success: (data) => data?.msg || "Group left successfully",
      error: (data) => data.errors[0].detail || "Failed to leave group",
    });
  };
  return (
    <div className="min-h-[26rem]">
      <nav className="flex justify-between items-center bg-gray-300 shadow-xl rounded-xl ">
        <button
          onClick={() => setSwitchGroup(false)}
          className={`text-black  p-3 text-center cursor-pointer  transition-all ease-linear duration-100  ${
            switchGroup
              ? "md:flex-[.4] bg-gray-300  rounded-r-xl"
              : "flex-1 bg-white  rounded-xl  "
          }`}
        >
          <h1 className="font-medium text-sm">Joined Groups</h1>
        </button>
        <button
          onClick={() => setSwitchGroup(true)}
          className={`text-black  p-3 text-center cursor-pointer transition-all ease-linear duration-100  ${
            switchGroup
              ? "flex-1 rounded-xl bg-white "
              : "md:flex-[.4] bg-gray-300 rounded-l-xl"
          }`}
        >
          <h1 className="font-medium text-sm">My Groups</h1>
        </button>
      </nav>
      <div className="flex-1  min-h-80 rounded-xl mt-4 ">
        {switchGroup ? (
          <>
            {data?.length === 0 && (
              <div className="flex justify-between items-center bg-white text-black shadow-xl rounded-xl p-4">
                <h1>You don&apos;t have Group!! Create One </h1>
                <button
                  onClick={() => setToggleCreateGroup(true)}
                  className="px-6 py-2 bg-purple-600 rounded-xl  text-white font-bold hover:bg-purple-700"
                >
                  Create group
                </button>
              </div>
            )}
            <div className="  flex flex-wrap justify-center md:grid md:grid-cols-2 gap-6 ">
              {data?.map((group) => (
                <GroupCard
                  group={group}
                  key={group.group_id}
                  setDeleteToggle={setDeleteToggle}
                  SetGroupData={SetGroupData}
                  mode="mygroup"
                />
              ))}
            </div>
          </>
        ) : (
          <div className="  flex flex-wrap justify-center md:grid md:grid-cols-2 gap-6 ">
            {JoinedFilterdGroup?.length === 0 && (
              <div className="flex justify-between items-center bg-white shadow-xl rounded-xl p-4">
                <h1>No Joined Group </h1>
                <Link
                  href={"/groups"}
                  className="px-6 py-2 bg-purple-600 rounded-xl  text-white font-bold hover:bg-purple-700"
                >
                  Join group
                </Link>
              </div>
            )}
            {JoinedFilterdGroup?.map((group) => {
              return (
                <GroupCard
                  group={group}
                  key={group.group_id}
                  setLeaveToggle={setLeaveToggle}
                  SetGroupData={SetGroupData}
                  mode="joinedgroup"
                />
              );
            })}
          </div>
        )}
      </div>
      {/* Delete group */}
      {deleteToggle && (
        <PopUpWrapper>
          <DeleteConfirm title={"Delete Group"}>
            <div className="flex gap-4 ">
              <button
                onClick={() => setDeleteToggle(!deleteToggle)}
                className="px-6 py-2 bg-purple-600 rounded-full  text-white font-bold hover:bg-purple-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
                className="px-6 py-2 bg-red-600 rounded-full  text-white font-bold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </DeleteConfirm>
        </PopUpWrapper>
      )}
      {/* Leave group */}
      {leaveGroupToggle && (
        <PopUpWrapper>
          <LeaveConfirm title={"Leave Group"}>
            <div className="flex gap-4 ">
              <button
                onClick={() => setLeaveToggle(!leaveGroupToggle)}
                className="px-6 py-2 bg-purple-600 rounded-full  text-white font-bold hover:bg-purple-700"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveGroup}
                className="px-6 py-2 bg-red-600 rounded-full  text-white font-bold hover:bg-red-700"
              >
                Leave
              </button>
            </div>
          </LeaveConfirm>
        </PopUpWrapper>
      )}
      {toggleCreateGroup && (
        <PopUpWrapper>
          <CreateGroup mode={"edit"} data={groupData} />
        </PopUpWrapper>
      )}
      {/* {toggleCreateAnnouncement && (
        <PopUpWrapper>
          <AnnouncementCardForm group_id={groupData?.group_id} />
        </PopUpWrapper>
      )} */}
    </div>
  );
};

export default Dashboard;
