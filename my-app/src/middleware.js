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

export async function middleware(request) {
  console.log("Middleware running for:", request.nextUrl.pathname);

  const token = request.cookies.get("token")?.value;
  console.log("Token from cookies:", token);

  if (!token) {
    console.log("No token found. Redirecting to /sign-in");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.jwtsecret || "stayinpeace");
    const { payload: user } = await jwtVerify(token, secret);

    console.log("Decoded user:", user);

    // Parse role if it's stored as a JSON string
    const role = user?.data?.role ? JSON.parse(user.data.role) : {};

    const pathname = request.nextUrl.pathname;

    // Define access control
    const rolePermissions = {
      admin: [
        "/dashboard",
        "/dashboard/users",
        "/dashboard/college",
        "/dashboard/institutions",
        "/dashboard/results",
        "/dashboard/news",
      ],
      subscriber: ["/dashboard", "/dashboard/results"],
      teacher: ["/dashboard", "/dashboard/agent", "/dashboard/results"],
      student: ["/dashboard", "/dashboard/results"],
      parent: ["/dashboard", "/dashboard/results"],
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

export const config = {
  matcher: ["/dashboard/:path*"],
};

