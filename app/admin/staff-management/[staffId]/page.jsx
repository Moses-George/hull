"use client";
import { stats } from "@/app/user/dashboard/stats";
import Modal from "@/components/Modal";
import { baseUrl } from "@/lib/configs";
import { getToken } from "@/utils/authHelpers";
import { formatDate } from "@/utils/helpers";
import { time } from "@/utils/time&dates";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CircleLoader, ClipLoader, FadeLoader } from "react-spinners";

const {
  default: DashboardLayout,
} = require("@/components/layouts/DashboardLayout");

const StaffProfile = () => {
  const params = useSearchParams();
  const staffId = params.get("id");
  const [data, setData] = useState();
  const [form, setForm] = useState([]);
  const [staffDetails, setStaffDetails] = useState([]);
  const [btnLoader, setBtnLoader] = useState(false);
  const [saveBtnLoader, setSaveBtnLoader] = useState(false);
  const [loader, setLoader] = useState(true);
  const token = getToken();
  const fetchStaff = async () => {
    try {
      const fetchData = await axios.get(`${baseUrl}/staff/${staffId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(fetchData);
      setData(fetchData?.data?.data?.staff[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchForm = async () => {
    try {
      const token = getToken();
      const fetchData = await axios.get(`${baseUrl}/forms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(fetchData);
      setForm(fetchData?.data?.data?.forms);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (staffId) {
      fetchStaff();
      fetchForm();
    }
  }, []);

  const [checkedItems, setCheckedItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const staffDetails = [
      {
        header: "Name",
        des: data?.name,
      },
      {
        header: "Email Address",
        des: data?.email,
      },
      {
        header: "Date Added",
        des: time.formatDate(data?.created_at),
      },
    ];

    data?.processableForms?.map((form) => {
      checkedItems.push(form.id);
    });

    setStaffDetails(staffDetails);
  }, [data]);

  const handleCheckboxChange = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems((prevIds) => prevIds.filter((prevId) => prevId !== id));
    } else {
      setCheckedItems((prevIds) => [...prevIds, id]);
    }
  };

  const updateStaff = async (name) => {
    try {
      console.log(name);
      const res = await axios.put(
        `${baseUrl}/staff/${staffId}`,
        {
          forms: checkedItems,
          is_admin: data?.is_admin,
          status: name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log({
        forms: checkedItems,
        is_admin: data?.is_admin,
        status: name,
      });

      if (res) {
        console.log(res);
        setData(res.data?.data?.staff);
        setBtnLoader(false);
        setSaveBtnLoader(false);
        setLoader(false);
        closeModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatBtn = () => {
    setBtnLoader(true);
    updateStaff(data?.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE");
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <DashboardLayout header="Admin">
      <div className="lg:flex lg:justify-between pb-8">
        <div className="w-full pb-8">
          <h1 className="text-black font-bold text-2xl">Staff Profile</h1>
          <p className="text-gray-600 text-sm">
            view all your account details below
          </p>
        </div>
        <div className="flex gap-x-4 w-full lg:justify-end">
          <button
            className="rounded-md h-[50%] text-sm text-[#46B038] p-2 border-[1px] border-solid border-[#46B038]"
            onClick={() => openModal()}
          >
            {data?.status === "ACTIVE" ? "Suspend" : "Activate"}
          </button>
          <button
            className="text-sm bg-[#46B038] h-[50%] text-white py-2 px-4 w-fit rounded-md"
            onClick={() => {
              setSaveBtnLoader(true);
              updateStaff(data?.status);
            }}
          >
            {saveBtnLoader ? (
              <ClipLoader color="#fff" size={25} />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
      {loader ? (
        <div className="w-full h-[40vh] flex items-center justify-center">
          <ClipLoader color="#46B038" size={50} />
        </div>
      ) : (
        <div className="bg-white rounded-lg pt-8 pl-4 pb-8">
          <h1 className="text-[#46B038] font-bold pt-4 pb-6">USER DETAILS:</h1>
          <div className="lg:flex lg:justify-between w-full">
            <div className="space-y-6 w-full">
              {staffDetails.map((data, index) => (
                <div key={index} className="w-[40%] space-y-2">
                  <h2 className="font-bold">{data.header}</h2>
                  <div className="border-[1px] border-gray-150 border-solid rounded-lg py-2 pl-4">
                    <p className="text-sm text-gray-400">{data.des}</p>
                  </div>
                </div>
              ))}
              <div
                className={`${
                  data?.status.toLowerCase() === "active"
                    ? "bg-[#e9fce9] text-sm text-[#69CB5C] text-center w-16 h-6 rounded-lg"
                    : "bg-[#EABD521F] text-sm text-[#EABD52] text-center w-16 h-6 rounded-lg"
                } w-fit px-[8px] py-[4px] capitalize `}
              >
                {data?.status}
              </div>
            </div>

            <div className="space-y-4 w-[60%] pt-8">
              <h1 className="font-bold">Roles</h1>

              {form.length > 0 &&
                form.map((formObj, i) => (
                  <div
                    key={i}
                    className="flex gap-x-2 text-sm items-center"
                    onClick={() => {
                      handleCheckboxChange(formObj.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.some((id) => id === formObj.id)}
                      className=" appearance-none w-4 h-4 border-[0.5px] border-gray-300 rounded-md checked:bg-green-500 checked:border-transparent focus:outline-none "
                      style={{
                        "--tw-ring-color": "transparent", // Optional: Remove focus ring
                      }}
                      onChange={() => handleCheckboxChange(formObj.id)}
                    />
                    <label htmlFor="">{formObj.name}</label>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <Modal
          handleClose={closeModal}
          btnLoader={btnLoader}
          handleStatBtn={handleStatBtn}
          text={data?.status === "ACTIVE" ? "suspend" : "activate"}
        />
      )}
    </DashboardLayout>
  );
};

export default StaffProfile;
