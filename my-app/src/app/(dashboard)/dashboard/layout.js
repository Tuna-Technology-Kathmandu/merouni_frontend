import SideBar from "../../components/Sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <SideBar />
          <div className="ml-20">
          {children}
          </div>
        </div>
      </body>
    </html>
  );
}
