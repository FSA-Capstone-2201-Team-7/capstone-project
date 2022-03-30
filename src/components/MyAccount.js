import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import MyListings from "./MyListings";
import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/outline";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const User = supabase.auth.user();
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from("users")
          .select("*")
          .eq("id", User.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          setUser(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div className="flex flex-col md:flex-row p-5 my-2 gap-8 md:gap-12">
          <div className="avatar-container flex items-center justify-center">
            <img
              className="h-52 w-48 rounded-full"
              src={
                user.avatarUrl
                  ? user.avatarUrl
                  : "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
              }
              alt=""
            />
          </div>

          <div>
            <h3>{user.username}</h3>
            <div className="flex space-x-4">
              <div>
                {" "}
                <ThumbDownIcon className="h-8 fill-yellow-400 stroke-yellow-500" />
                <p>
                  {" "}
                  {Math.ceil(
                    100 * (user.downvotes / (user.upvotes + user.downvotes))
                  )}
                </p>
              </div>
              <div>
                {" "}
                <ThumbUpIcon className="h-8 fill-yellow-400 stroke-yellow-500" />
                <p>
                  {" "}
                  {Math.ceil(
                    100 * (user.upvotes / (user.upvotes + user.downvotes))
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3>Total Swaps Completed</h3>
            <div className="flex space-x-4">
              <div>
                <div className="flex items-center ">
                  <p className="text-xl pr-1">Completed </p>
                  <div className="inline-flex w-4 h-4 bg-gray-400 rounded-full"></div>
                </div>
                <div className="flex justify-center">
                  {user.swaps_completed}
                </div>
              </div>
              <div>
                <div className="flex items-center ">
                  <p className="text-lg pr-1">Active </p>
                  <div className="inline-flex w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Link to="/editProfile">
              <button className="cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white w-full hover:bg-indigo-400">
                Edit Account
              </button>
            </Link>
          </div>
        </div>
      )}
      <MyListings />
    </div>
  );
};

export default Profile;
