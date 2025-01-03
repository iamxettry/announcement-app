"use client";
import { useStore } from "@/stores/store";
import Cookies from "js-cookie";
import { Check, XCircleIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CardDescription } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import dynamic from "next/dynamic";
const QuillEditor = dynamic(() => import("../layout/QuillEditor"), {
  ssr: false,
});

const CreateGroup = ({ mode, data }) => {
  const router = useRouter();
  // input refs
  const groupNameRef = useRef(null);
  const descRef = useRef(null);
  const categoryRef = useRef(null);
  const CustomcategoryRef = useRef(null);
  const typeRef = useRef(null);
  const imageRef = useRef(null);

  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [createCategoryMode, setCreateCategoryMode] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [CustomeCategory, setCustomeCategory] = useState("");
  const [groupType, setGroupType] = useState("");
  const [image, setImage] = useState("");
  const access_token = Cookies.get("access_token");
  const setToggleCreateGroup = useStore((state) => state.setToggleCreateGroup);
  const group_id = data?.group_id;

  const handleFileChange = async (e) => {
    if (!e.target.files[0].type.startsWith("image/")) {
      return;
    }
    setImage(e.target.files[0]);
  };
  useEffect(() => {
    if (mode === "edit") {
      setName(data?.name);
      setDescription(data?.description);
      setCategory(data?.category);
      setGroupType(data?.group_type);
    }
  }, [mode, data?.name, data?.description, data?.category, data?.group_type]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      groupNameRef.current.focus();
      toast.error("Group name is required");
      return;
    }

    if (!createCategoryMode) {
      if (category === "any" || category === "") {
        categoryRef.current.focus();
        toast.error("Please select a category");
        return;
      }
    }
    if (createCategoryMode) {
      if (!CustomeCategory) {
        CustomcategoryRef.current.focus();
        toast.error("Please enter a category");
        return;
      }
    }
    if (groupType === "") {
      typeRef.current.focus();
      toast.error("Please select a group type");
      return;
    }
    if (!image && mode !== "edit") {
      imageRef.current.focus();
      toast.error("Group image is required");
      return;
    }
    if (!description) {
      if (descRef.current) {
        descRef.current.focus();
      }
      toast.error("Group description is required");
      return;
    }
    let categoryId = null;
    if (createCategoryMode && CustomeCategory) {
      const isExist = checkExistingCategory(CustomeCategory);
      if (!isExist) {
        const res = await CategorySelectOrCreate();
        categoryId = res.id;
      }
    }

    const data = new FormData();
    data.append("image", image);
    data.append("name", name);
    data.append("description", description);
    if (createCategoryMode) {
      data.append("category", categoryId);
    } else {
      data.append("category", category);
    }
    data.append("group_type", groupType);
    const newPromise = new Promise(async (resolve, reject) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DB_BASE_URL}/group/${
          mode === "edit" ? `update/${group_id}/` : "create/"
        }`,
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
          body: data,
        }
      );
      const result = await response.json();
      if (response.ok) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DB_BASE_URL}/group/created-by/user/?limit=100`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        if (res.ok) {
          const result = await res.json();
          const lastCreatedGroup = result.results[result.results.length - 1];
          const lastCreatedGroupId = lastCreatedGroup.group_id;
          router.push(
            `/groups/${name}?group_id=${lastCreatedGroupId}&&category=${category}`
          );
        }
        setToggleCreateGroup(false);
        resolve(result);
      } else {
        reject(result);
      }
    });
    toast.promise(newPromise, {
      loading: mode === "edit" ? "Updating group..." : "Creating group...",
      success:
        mode === "edit"
          ? "Group updated successfully!"
          : (data) => data?.msg || "Group created successfully!",
      error: (result) => result.errors[0].detail || "An error occurred",
    });
  };

  const checkExistingCategory = (value) => {
    if (value && categoriesOptions?.results) {
      const existingCategory = categoriesOptions?.results.find(
        (category) => category.name === value
      );
      if (existingCategory) {
        setCreateCategoryMode(false);
        setCategory(existingCategory.id);
        return true;
      }
    }
  };
  const CategorySelectOrCreate = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DB_BASE_URL}/group/category/create/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: CustomeCategory }),
      }
    );
    if (response.ok) {
      const result = await response.json();
      setCategory(result.id);
      setCreateCategoryMode(false);
      return result;
    }
    if (!response.ok) {
      const result = await response.json();
      console.log(result);
    }
  };

  const group_type = [
    { value: "", label: "Select Type" },
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
  ];
  useEffect(() => {
    const fetchCategories = async () => {
      if (category === "custome") {
        setCustomeCategory("");
        setCategory("");
        setCreateCategoryMode(true);
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DB_BASE_URL}/group/category/list/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        if (result.length === 0) {
          setCreateCategoryMode(true);
          CustomcategoryRef.current.focus();
        }
        setCategoriesOptions(result);
      }
    };
    fetchCategories();
  }, [createCategoryMode, category, access_token]);
  useEffect(() => {
    if (groupNameRef.current) {
      groupNameRef.current.focus();
    }
    if (CustomcategoryRef.current) {
      CustomcategoryRef.current.focus();
    }
  }, [createCategoryMode]);

  return (
    <div className="bg-white mx-4  rounded-xl border-2  w-[90%] md:w-auto shadow-lg shadow-gray-500 relative z-20 p-4 dark:shadow-none">
      <div className="flex justify-end items-center  absolute right-4 top-2 ">
        <button
          onClick={() => setToggleCreateGroup(false)}
          className="p-1 bg-white text-red-500 hover:bg-red-200 rounded-full border  shadow-md shadow-gray-500"
        >
          <XIcon />
        </button>
      </div>
      <div className="p-4 pb-0">
        <h1 className="text-lg md:text-2xl  font-bold tracking-widest text-black">
          {mode === "edit" ? "Edit Your group" : "Create New Group"}
        </h1>
        <CardDescription className="text-sm text-gray-900 dark:text-gray-700">
          {mode === "edit" ? "Edit your Group." : "Create a new group."}
        </CardDescription>
      </div>
      <div className="">
        <form
          action=""
          className=" p-4 pt-0 rounded-md"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="grid gap-4 md:grid-cols-2 ">
            <div className="grid gap-4">
              <div className=" md:space-y-2">
                <Label
                  className="hidden md:flex text-black mt-2  "
                  htmlFor="group_name"
                >
                  Group name
                </Label>
                <Input
                  ref={groupNameRef}
                  type="text"
                  name="group_name"
                  id="group_name"
                  value={name}
                  autoComplete="off"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter group name"
                  className="border border-gray-600 focus:border-purple-700 bg-white"
                />
              </div>
              <div>
                <Label
                  className="hidden md:flex text-black mt-2  "
                  htmlFor="groupType"
                >
                  Group Type
                </Label>

                <select
                  ref={typeRef}
                  name="groupType"
                  value={groupType}
                  autoComplete="off"
                  onChange={(e) => setGroupType(e.target.value)}
                  className="block w-full px-4 mt-2 py-2 text-gray-500 bg-white border border-gray-600  focus:border-purple-700 rounded-md focus:outline-none text-sm font-medium appearance-none "
                >
                  {group_type.map((type) => (
                    <option
                      className="w-fit py-2 px-4 text-black"
                      key={type.value}
                      value={type.value}
                      autoComplete="off"
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className=" group md:space-y-2 relative">
                {createCategoryMode ? (
                  <>
                    <Label
                      className="hidden md:flex text-black mt-2  "
                      htmlFor="CustomCategory"
                    >
                      New Category
                    </Label>
                    <Input
                      ref={CustomcategoryRef}
                      type="text"
                      name="CustomCategory"
                      id="CustomCategory"
                      value={CustomeCategory}
                      autoComplete="off"
                      onChange={(e) => setCustomeCategory(e.target.value)}
                      placeholder="Enter New Category"
                      className="border border-gray-600 focus:border-purple-700 bg-white text-sm"
                    />
                    {categoriesOptions?.length !== 0 && (
                      <span
                        className="text-red-500 cursor-pointer absolute right-2 bottom-2 flex justify-center items-center "
                        onClick={() => setCreateCategoryMode(false)}
                      >
                        <XCircleIcon />
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <Label
                      className="hidden md:flex text-black mt-2  "
                      htmlFor="category"
                    >
                      Group Category
                    </Label>

                    <select
                      ref={categoryRef}
                      name="category"
                      value={category}
                      autoComplete="off"
                      onChange={(e) => setCategory(e.target.value)}
                      className="block w-full px-4 py-2 text-gray-500 bg-white border border-gray-600  focus:border-purple-700 rounded-md focus:outline-none text-sm font-medium appearance-none "
                    >
                      {mode !== "edit" && (
                        <>
                          <option
                            className="w-fit py-2 px-4 text-black"
                            value={"any"}
                            autoComplete="off"
                          >
                            Select Category
                          </option>
                          {/* <option
                            className="w-fit py-2 px-4 text-black"
                            value={"custome"}
                            autoComplete="off"
                          >
                            Custom Option
                          </option> */}
                          {categoriesOptions?.map((option) => (
                            <option
                              className="w-fit py-2 px-4 text-black"
                              key={option.id}
                              value={option.id}
                              autoComplete="off"
                            >
                              {option.name}
                            </option>
                          ))}
                        </>
                      )}
                      {mode === "edit" && (
                        <>
                          {categoriesOptions?.map((option) => (
                            <option
                              className="w-fit py-2 px-4 text-black"
                              key={option.id}
                              value={option.id}
                              autoComplete="off"
                            >
                              {option.name}
                            </option>
                          ))}
                          {/* <option
                            className="w-fit py-2 px-4 text-black"
                            value={"custome"}
                            autoComplete="off"
                          >
                            Custom Option
                          </option> */}
                        </>
                      )}
                    </select>
                  </>
                )}
              </div>

              <div className="">
                <Label
                  className="hidden md:flex text-black mt-2  "
                  htmlFor="group_image "
                >
                  Group Image
                </Label>
                <input
                  ref={imageRef}
                  type="file"
                  name="group_image"
                  id="group_image"
                  className="block  mt-2 px-1 w-full text-sm text-gray-900 bg-transparent border-0  appearance-none  focus:outline-none focus:ring-0  peer file:mr-4 file:py-2 file:px-4 
            file:rounded-full file:border-0
            file:text-sm file:font-semibold rounded-md
            file:bg-violet-100 file:text-violet-700
            hover:file:bg-violet-400 shadow-sm shadow-gray-100 focus:border focus:border-purple-400"
                  onChange={handleFileChange}
                  placeholder=" "
                />
              </div>
            </div>
          </div>
          <div className="md:space-y-2">
            <Label
              className="hidden md:flex text-black mt-2  "
              htmlFor="group_description"
            >
              Description
            </Label>
            <div  className="text-black ">
              <QuillEditor
                value={description}
                onChange={setDescription}
                size={100}
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-purple-300  font-bold rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center  "
              >
                {mode === "edit" ? "Update Group" : "Create Group"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
