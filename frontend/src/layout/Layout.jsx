import MainNavigation from "./MainNavigation";

const Layout = (props) => {
    return (
        <div>
            <MainNavigation />
            <main className="px-4 py-4">{props.children}</main>
        </div>
    );
};

export default Layout;
