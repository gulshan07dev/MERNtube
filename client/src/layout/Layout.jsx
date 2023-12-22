import Navbar from "../component/navbar/Navbar";
import Sidebar from "../component/sidebar/Sidebar";
import { navHeight } from "../constant";

export default function Layout({
  children,
  className,
  isShowNavigationBar = true,
}) {
  return isShowNavigationBar ? (
    <>
      <Navbar />
      <div
        style={{ height: `calc(100vh - ${navHeight})` }}
        className="w-full flex overflow-y-scroll"
        role="region"
        aria-label="Main Content"
      >
        <Sidebar />
        <main className="flex-1 flex-grow" role="main">
          <section className={`min-h-full ${className}`}>{children}</section>
        </main>
      </div>
    </>
  ) : (
    <main role="main">
      <section className={`min-h-full ${className}`}>{children}</section>
    </main>
  );
}
