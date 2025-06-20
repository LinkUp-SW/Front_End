import { Card, CardContent } from "../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
// import { useDispatch } from "react-redux";
// import { handleOpenModalType } from "@/utils";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

import React from "react";

import {
  openCompanyPostDialog,
  openCreatePostDialog,
} from "@/slices/feed/createPostSlice";
import Cookies from "js-cookie";
import { BasicCompanyData } from "@/pages/company/ManageCompanyPage";

interface CreatePostProps {
  className?: string;
  company?: BasicCompanyData;
}

const user_id = Cookies.get("linkup_user_id");

const CreatePost: React.FC<CreatePostProps> = ({ className, company }) => {
  //const posts = useSelector((state: RootState) => state.posts.list);
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state: RootState) => state.userBio);

  return (
    <>
      <Card
        className={`mb-1 w-full bg-white border-0 pr-4 dark:bg-gray-900 ${className}`}
      >
        <CardContent>
          <div className="flex space-x-3 justify-start items-start">
            <Link
              to={
                company?._id
                  ? `/company-profile/${company._id}`
                  : `/user-profile/${user_id}`
              }
            >
              <Avatar className="h-12 w-12 pl-0">
                {loading ? (
                  <>
                    <div className="h-14 w-14 animate-pulse rounded-full bg-gray-300" />
                  </>
                ) : (
                  <>
                    <AvatarImage
                      className="h-12 w-12"
                      src={company ? company.logo : data?.profile_photo || ""}
                      alt="Profile"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </>
                )}
              </Avatar>
            </Link>
            <Button
              variant="ghost"
              id="create-post-button"
              onClick={() => {
                if (company) {
                  dispatch(openCompanyPostDialog(company));
                } else {
                  dispatch(openCreatePostDialog());
                }
              }}
              className="w-[90%] h-11 border p-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors hover:cursor-pointer hover:text-gray-950 dark:hover:text-neutral-200 rounded-full border-gray-400 font-medium text-black focus:outline-none text-left dark:text-neutral-300"
            >
              <p className="w-full">Start a post</p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CreatePost;
