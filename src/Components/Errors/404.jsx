import { Button } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import Error404Svg from "../Assets/Icon/404";
import PelindoLogo from "../Assets/Pictures/PelindoLogo.webp";

export default function Error404() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-white py-12 px-20 min-h-screen">
      <Link to="/" className="cursor-pointer">
        <img
          src={PelindoLogo}
          alt="company_logo"
          className="h-[40px] p-2"
        />
      </Link>
      <div className="flex flex-col gap-8 m-auto w-[] items-center">
        <Error404Svg />
        <div className="flex flex-col text-center">
          <h2 className="font-semibold">
            The page you’re looking for is missing
          </h2>
          <p className="text-darkGrey">
            Sorry we could not find your page.
          </p>
        </div>
        <Button
          className="font-medium bg-primary w-[150px]"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
      <footer className="text-center">
        <p className="text-darkGrey">
          Powered by KMPlus Consulting 2022
        </p>
      </footer>
    </div>
  );
}
