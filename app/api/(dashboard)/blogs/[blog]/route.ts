import  connect  from "@/lib/db";
import User from "@/lib/modals/users";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import {Types} from "mongoose"
import Blog from "@/lib/modals/blogs";




export const GET = async (request: Request, context : {params:any}) => {

    const blogId = context.params.blog;
    
    try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const categoryid = searchParams.get('categoryId');

    if(!userId || !Types.ObjectId.isValid(userId) ) { 
            return new NextResponse("user Id not found", {status: 400})
    }
    if(!categoryid || !Types.ObjectId.isValid(categoryid) ) { 
            return new NextResponse("category Id not found", {status: 400})
    }

    if(!blogId || !Types.ObjectId.isValid(blogId) ) { 
            return new NextResponse("blog Id not found", {status: 400})
    }

      await connect()

    const user = await User.findById(userId)
    if(!user) {
    return new NextResponse(JSON.stringify({message : "User not found}"}),{status: 400})
    }

    const category = await Category.findById(categoryid)
    if(!category) {
    return new NextResponse(JSON.stringify({message : "category not found}"}),{status: 400})
    }
        const blog = await Blog.findOne({_id: blogId,category: new Types.ObjectId(categoryid),user: new Types.ObjectId(userId),})
        if(!blog) {
            return new NextResponse(JSON.stringify({message : "Blog not found"}),{status: 404})
        }
        return new NextResponse(JSON.stringify(blog),{ status: 200 })
    } catch (error) {
        console.error(error)
        return new NextResponse(JSON.stringify({message : "Error fetching blog"}),{status: 500})
    }



}


export const PATCH = async (request: Request, context : {params:any}) => {

    const blogId = context.params.blog;

    try {
    const body = await request.json();
    const {title , description} = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

      if(!userId || !Types.ObjectId.isValid(userId) ) { 
        return new NextResponse("user Id not found", {status: 400})
    }

      if(!blogId || !Types.ObjectId.isValid(blogId) ) { 
            return new NextResponse("blog Id not found", {status: 400})
    }
    await connect()

    const user = await User.findById(userId)

   if(!user) {
    return new NextResponse(JSON.stringify({message : "User not found}"}),{status: 400})
    }

    const blog = await Blog.findOne({_id: blogId , user: userId})
    
    if(!blog) {
    return new NextResponse(JSON.stringify({message : "blog not found}"}),{status: 400})
    }

   const updatedBlog = await Blog.findByIdAndUpdate(blogId,{title , description},{ new : true} )
    
   return new NextResponse(JSON.stringify({message : "updated Blog", category:updatedBlog}),{status: 200})

    } catch (error:any) {
          return new NextResponse("Error in updated a blog" + error.message , {status:500})
}



}

export const DELETE = async (request: Request, context : {params:any}) => {

    const blogId = context.params.blog;
    try {

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

      if(!userId || !Types.ObjectId.isValid(userId) ) { 
        return new NextResponse("user Id not found", {status: 400})
    }
  
    if(!blogId || !Types.ObjectId.isValid(blogId) ) { 
        return new NextResponse("blog Id not found", {status: 400})
    }

    await connect()

    const user = await User.findById(userId)

   if(!user) {
    return new NextResponse(JSON.stringify({message : "User not found}"}),{status: 400})
    }

    const blog = await Blog.findOne({_id: blogId ,user: userId})

   if(!blog) {
    return new NextResponse(JSON.stringify({message : "blog not found}"}),{status: 400})
    }

    await Blog.findByIdAndDelete(blogId)
    

   return new NextResponse(JSON.stringify({message : "blog deleted"}),{status: 200})

    } catch (error:any) {
          return new NextResponse("Error in deleting the blogId" + error.message , {status:500})
}




}