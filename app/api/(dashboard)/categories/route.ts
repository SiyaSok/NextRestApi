/** @format */

// /** @format */

// // import  connect  from "@/lib/db";
// // import User from "@/lib/modals/users";
// // import Category from "@/lib/modals/category";
// // import { NextResponse } from "next/server";
// // import {Types} from "mongoose"

// import connect from "@/lib/db";
// import User from "@/lib/modals/users";
// import Category from "@/lib/modals/category";
// import { NextResponse } from "next/server";
// import { Types } from "mongoose"; // Use ES6 import

// export const GET = async (request: Request) => {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get("userId");

//     if (!userId || !Types.ObjectId.isValid(userId)) {
//       return new NextResponse("Invalid or missing user ID", { status: 400 });
//     }

//     await connect();

//     const user = await User.findById(userId);
//     if (!user) {
//       return new NextResponse(JSON.stringify({ message: "User not found" }), {
//         status: 404,
//       });
//     }

//     const categories = await Category.find({
//       user: new Types.ObjectId(userId),
//     });

//     return new NextResponse(JSON.stringify(categories), { status: 200 });
//   } catch (error: unknown) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error occurred";
//     return new NextResponse("Error fetching categories: " + errorMessage, {
//       status: 500,
//     });
//   }
// };

// export const POST = async (request: Request) => {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get("userId");

//     const body = await request.json();
//     const { title } = body;

//     if (!userId || !Types.ObjectId.isValid(userId)) {
//       return new NextResponse("Invalid or missing user ID", { status: 400 });
//     }
//     if (!title || typeof title !== "string") {
//       return new NextResponse("Invalid or missing title", { status: 400 });
//     }

//     await connect();

//     const user = await User.findById(userId);
//     if (!user) {
//       return new NextResponse(JSON.stringify({ message: "User not found" }), {
//         status: 404,
//       });
//     }

//     const newCategory = new Category({
//       title,
//       user: new Types.ObjectId(userId),
//     });

//     await newCategory.save();

//     return new NextResponse(JSON.stringify(newCategory), { status: 201 });
//   } catch (error: unknown) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error occurred";
//     return new NextResponse("Error creating category: " + errorMessage, {
//       status: 500,
//     });
//   }
// };
