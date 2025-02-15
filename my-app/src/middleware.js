// import { NextResponse } from "next/server";

// export function middleware(request) {
//   console.log("Middleware running for:", request.nextUrl.pathname);

//   const accessToken = request.cookies.get("token");
//   console.log("Access token:", accessToken);

//   if (request.nextUrl.pathname.startsWith("/dashboard")) {
//     if (!accessToken) {
//       console.log("Redirecting to /sign-in");
//       return NextResponse.redirect(new URL("/sign-in", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { decodeJwt } from "jose";
export async function middleware(request) {
  console.log("Middleware running for:", request.nextUrl.pathname);

  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  // If the user is trying to access the /sign-in page and is already logged in, redirect to /dashboard
  if (pathname === "/sign-in" && token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.jwtsecret || "stayinpeace"
      );
      // await jwtVerify(token, secret);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      console.error("Invalid token:", error);
      // If the token is invalid, let the user proceed to /sign-in
      return NextResponse.next();
    }
  }

  // If the user is not logged in and tries to access protected routes, redirect to /sign-in
  if (!token && pathname.startsWith("/dashboard")) {
    console.log("No token found. Redirecting to /sign-in");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If the user is logged in, verify the token and check permissions
  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.jwtsecret || "stayinpeace"
      );
      // const { payload: user } = await jwtVerify(token, secret);
      const user = decodeJwt(token);

      // Parse role if it's stored as a JSON string
      const role = user?.data?.role ? JSON.parse(user.data.role) : {};

      // Define access control
      const rolePermissions = {
        admin: [
          "/dashboard",
          "/dashboard/insights",
          "/dashboard/academia",
          "/dashboard/addCollege",
          "/dashboard/category",
          "/dashboard/events",
          "/dashboard/faculty",
          "/dashboard/media",
          "/dashboard/news",
          "/dashboard/profile",
          "/dashboard/program",
          "/dashboard/scholarship",
          "/dashboard/university",
          "/dashboard/users",
          "/dashboard/agent",
          "/dashboard/agentApprove",
          "/dashboard/exams",
          "/dashboard/courses"

        ],
        editor: [
          "/dashboard",
          "/dashboard/insights",
          "/dashboard/academia",
          "/dashboard/addCollege",
          "/dashboard/category",
          "/dashboard/events",
          "/dashboard/faculty",
          "/dashboard/media",
          "/dashboard/news",
          "/dashboard/profile",
          "/dashboard/program",
          "/dashboard/shcolarship",
          "/dashboard/university",
          "/dashboard/users",
          "/dashboard/agent",
          "/dashboard/career",
          "/dashboard/consultancy",


        ],
        agent: ["/dashboard/referStudent"],
        teacher: ["/dashboard", "/dashboard/material", "/dashboard/profile"],
        student: ["/dashboard", "/dashboard/profile"],
        superadmin: ["*"], // Full access
      };

      // Check if user has access
      const hasAccess = Object.entries(rolePermissions).some(
        ([roleName, paths]) =>
          role[roleName] && (paths.includes(pathname) || paths.includes("*"))
      );

      if (!hasAccess) {
        console.log("Access denied. Redirecting to /403");
        return NextResponse.redirect(new URL("/403", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Invalid token:", error);
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in"],
};
