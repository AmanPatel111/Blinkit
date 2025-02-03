import React from "react";
import logo from "../assets/logo.png";

const Header = () => {
  return (
    <header className="h-24 shadow-md sticky top-0 items-center flex">
      <div className="container mx-auto ">
        {/* Logo */}
        <div>
          <div>
            <img src={logo} width={200} height={70} alt="Logo"/>
          </div>
        </div>
        {/* search */}
<div>

</div>
        {/* login & Cart */}

<div></div>

      </div>
    </header>
  );
};

export default Header;
