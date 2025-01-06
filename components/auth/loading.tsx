import Image from "next/image";
export const Loading = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center ">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={80}
        height={80}
        className="animate-pulse duration-700"
      ></Image>
    </div>
  );
};
