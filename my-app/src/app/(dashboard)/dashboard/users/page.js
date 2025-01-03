import { AiFillEdit, AiFillDelete } from "react-icons/ai";

export default async function Page() {
  try {
    const data = await fetch(
      "http://localhost:5000/api/v1/users?limit=10&page=1&sort=desc"
    );

    console.log(data);
    if (!data.ok) {
      throw new Error("Failed to fetch data");
    }

    const users = await data.json();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-8">
        {users.items.map((user) => (
          <div
            key={user._id}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex space-x-2">
                <AiFillEdit
                  className="text-blue-500 cursor-pointer"
                  size={20}
                />
                <AiFillDelete
                  className="text-red-500 cursor-pointer"
                  size={20}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">Email: {user.email}</p>
            <p className="text-sm text-gray-600">Phone: {user.phone_no}</p>
            <p className="text-sm text-gray-600">
              Roles: {Object.keys(user.roles).join(", ")}
            </p>
            <p className="text-sm text-gray-600">
              Created At: {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Failed to load user data</div>;
  }
}
