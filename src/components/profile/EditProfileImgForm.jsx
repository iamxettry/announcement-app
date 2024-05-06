import { useStore } from "@/stores/store";
import Cookies from "js-cookie";
import { XCircle } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const EditProfileForm = ({ setToggle }) => {
  const [file, setFile] = useState("");
  const access_token = Cookies.get("access_token");

  const SetUserData = useStore((state) => state.setUserData);
  const handleFileChange = async (e) => {
    if (!e.target.files[0].type.startsWith("image/")) {
      return;
    }
    setFile(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("select the profile");
      return;
    }
    const formData = new FormData();
    formData.append("profilepic", file);
    const newPromise = new Promise(async (resolve, reject) => {
      const respone = await fetch("http://127.0.0.1:8000/api/v1/user/update/", {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${access_token}`,
        },
        body: formData,
      });
      if (respone.ok) {
        const result = await respone.json();
        SetUserData(result);
        setToggle(false);
        resolve();
      } else {
        const result = await respone.json();
        reject(result);
      }
    });

    toast.promise(newPromise, {
      loading: "Uploading....",
      success: "Profile Uploaded!!",
      error: (data) => (data ? data.errors[0].detail : "Upload Failed!!"),
    });
  };
  return (
    <div className="relative">
      <div className="w-96 rounded-xl mx-auto bg-gray-300 absolute top-1/3 left-1/2 border border-gray-400 shadow-md shadow-gray-500">
        <div className="flex justify-end p-4 ">
          <span
            className="text-red-500 cursor-pointer "
            onClick={() => setToggle(false)}
          >
            <XCircle />
          </span>
        </div>
        <form
          className="flex px-4  my-2"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <input
            type="file"
            className="
            flex-1 
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-300
            "
            name="profile_image"
            id="profile_Image"
            onChange={handleFileChange}
          />
          <input
            type="submit"
            value="Upload"
            className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600"
          />
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
