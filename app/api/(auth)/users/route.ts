/** @format */

import connect from "@/lib/db";
import User from "@/lib/modals/users";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { ObjectId } = require("mongoose").Types;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse("Error in fetching users: " + error.message, {
        status: 500,
      });
    }
    return new NextResponse("An unknown error occurred.", { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { username, password, ...otherData } = body;

    await connect();

    // Check if a user with the same username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return new NextResponse("User already exists", { status: 409 });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const user = new User({
      username,
      password: hashedPassword,
      ...otherData,
    });

    await user.save();
    return new NextResponse(JSON.stringify(user), { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse("Error in adding a user: " + error.message, {
        status: 500,
      });
    }
    return new NextResponse("An unknown error occurred.", { status: 500 });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;

    await connect();

    if (!userId || !newUsername) {
      return new NextResponse("UserId or new username not found", {
        status: 400,
      });
    }

    if (!ObjectId.isValid(userId)) {
      return new NextResponse("Invalid UserId", { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      new ObjectId(userId),
      { username: newUsername },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in db" }),
        { status: 400 }
      );
    }

    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse("Error in updating users: " + error.message, {
        status: 500,
      });
    }
    return new NextResponse("An unknown error occurred.", { status: 500 });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("UserId not found", { status: 400 });
    }

    if (!ObjectId.isValid(userId)) {
      return new NextResponse("Invalid UserId", { status: 400 });
    }

    await connect();

    const deletedUser = await User.findByIdAndDelete(new ObjectId(userId));

    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in db" }),
        { status: 400 }
      );
    }

    return new NextResponse(JSON.stringify(deletedUser), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse("Error in deleting users: " + error.message, {
        status: 500,
      });
    }
    return new NextResponse("An unknown error occurred.", { status: 500 });
  }
};
