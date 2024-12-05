/** @format */

import connect from "@/lib/db";
import User from "@/lib/modals/users";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { username, password } = body;

    await connect();

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Compare password with hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return new NextResponse("Invalid password", { status: 401 });
    }

    // Verify JWT_SECRET is defined
    const secret = process.env.JWT_SECRET;
    if (!secret)
      throw new Error("JWT secret is not defined in environment variables");

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      secret,
      { expiresIn: "1h" }
    );

    // Send the user data and token in the response
    return new NextResponse(
      JSON.stringify({
        token,
        user: { id: user._id, username: user.username },
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse(`Error in fetching users: ${error.message}`, {
        status: 500,
      });
    }
    return new NextResponse("An unknown error occurred", { status: 500 });
  }
};
