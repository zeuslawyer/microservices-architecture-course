import Link from "next/link";

const Header = ({ currentUser }) => {
  const menuOptions = [
    !currentUser && {
      label: "Sign up",
      href: "/auth/signup"
    },
    !currentUser && {
      label: "Sign in",
      href: "/auth/signin"
    },
    currentUser && {
      label: "Sign out",
      href: "/auth/signout"
    }
  ];

  const links = menuOptions
    // filter out options tht evaluate to true
    .filter(opt => !!opt)
    // return a jsx list of li elements
    .map(({ label, href }) => (
      <li className="nav-item" key={href}>
        <Link href={href}>
          <a className="nav-link">{label}</a>
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">MyStubHub</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
