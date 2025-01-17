'use client'
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Eye, ChartBarIncreasing, } from 'lucide-react';

const AnnouncementList = ({ group_id })=>{
    const access_token = Cookies.get("access_token");
    const [announementDatas, setAnnouncementDatas] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch data from the API
      useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_DB_BASE_URL}/announcement/list/group/${group_id}/`,
              {
                method: "GET",
                headers: {
                  authorization: `Bearer ${access_token}`,
                },
              }
            );
    
            if (!response.ok) {
              if (response.status === 403) {
                setPermission(false);
              } else {
                console.error("Failed to fetch data");
              }
              setLoading(false);
              return;
            }
    
            const result = await response.json();
            setAnnouncementDatas(result.results); // Set fetched data
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [access_token, group_id]);

    return (
        <div className="shadow-custom-all rounded-xl">
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                <div className="animate-spin border-t-4 border-purple-500 border-solid rounded-full w-16 h-16"></div>
                </div>
            ) : announementDatas.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <Link href={"/announcements/create-new?select_group=true"} className="text-gray-500 font-bold">Create Announcements</Link>
                </div>
            ) : (
                <div className='w-full pb-6 px-10'>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b-2 border-gray-300'>
                                <td className='py-4 font-bold'>Announcement Title</td>
                                <td className='py-4 font-bold'>Likes/Dislike</td>
                                <td className='py-4 font-bold'>Comments</td>
                                <td className='py-4 font-bold'>Action</td>
                            </tr>
                        </thead>
                        <tbody className='py-4'>
                        {announementDatas?.map((announcement) => (
                            <tr key={announcement.id} className="border-b-2 border-gray-300">
                                <td className="py-4">{announcement.title}</td>
                                <td className="py-4">{announcement.likes}/{announcement.dislikes}</td>
                                <td className="py-4">{announcement.total_comments}</td>
                                <td className="py-4">
                                <div className="flex gap-x-4 w-fit">
                                    <div title="View" className="relative">
                                    <Link href={`/announcements/${announcement.title.toLowerCase().replace(/\s+/g, "-")}?ann_id=${announcement.id}`}>
                                        <Eye />
                                    </Link>
                                    </div>
                                    <div title="Analytics" className="relative">
                                    <Link href={`/analytics/announcement?ann_id=${announcement.id}`}>
                                        <ChartBarIncreasing />
                                    </Link>
                                    </div>
                                </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AnnouncementList