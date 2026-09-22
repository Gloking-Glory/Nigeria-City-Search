"use client";
import { useForm } from "react-hook-form";
import { SearchType } from "@/src/components/utilities/types";

export default function Search() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SearchType>();

  const onSubmit = async (data: SearchType) => {
    const { search } = data;
    console.log(search);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/background.png')] bg-cover bg-center px-4 sm:px-6 lg:px-">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          bg-white 
          p-6 sm:p-8 lg:p-10 
          rounded-2xl shadow-lg 
          w-full 
          max-w-sm sm:max-w-md lg:max-w-lg
        "
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center text-blue-600">
          Search Location
        </h2>

        {/* <CustomInput
          label="Username"
          error={errors.search}
          {...register("search", { required: "Username is required" })}
        /> */}

      </form>
    </div>
  );
}
