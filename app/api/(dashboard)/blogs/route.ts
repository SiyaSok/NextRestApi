import  connect  from "@/lib/db";
import User from "@/lib/modals/users";
import Category from "@/lib/modals/category";
import Blog from "@/lib/modals/blogs";
import { NextResponse } from "next/server";
import {Types} from "mongoose"


export const GET = async (request: Request) => {

     try {
    
       const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const categoryid = searchParams.get('categoryid');
        
        const searchKeywords = searchParams.get('Keywords') as string;
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const page =  parseInt(searchParams.get('page' )|| "1");
        const limit =  parseInt(searchParams.get('limit') || "10")

        if(!userId || !Types.ObjectId.isValid(userId) ) { 
                return new NextResponse("user Id not found", {status: 400})
        }

        if(!categoryid || !Types.ObjectId.isValid(categoryid) ) { 
                return new NextResponse("category Id not found", {status: 400})
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

    const filter : any = {
        user: new Types.ObjectId(userId),
        category: new  Types.ObjectId(categoryid),
    }

    if(searchKeywords)
    {
        filter.$or = [
            {
                title:{ $regex: searchKeywords, $options: 'i'},
            }
            ,
            {
                description:{ $regex: searchKeywords, $options: 'i'},
            }
        ]
    }

    if(startDate && endDate) {
        filter.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        }
    } else if(startDate) {
        filter.createdAt = { $gte: new Date(startDate) }
    }
    else if(endDate) {
        filter.createdAt = { $lte: new Date(endDate) }
    }

    const skip = (page - 1) * limit

    const blogs = await Blog.find(filter).skip(skip).limit(limit).exec()

    return new NextResponse(JSON.stringify(blogs), {status:200})

  } catch (error:any) {
          return new NextResponse("Error in fetching Blogs" + error.message , {status:500})
  }


}

export const POST = async (request: Request) => {

    try {
    const {searchParams} = new URL(request.url)
    const userId = searchParams.get('userId');
    const categoryId = searchParams.get('categoryId');

     const body   =await request.json();
    
     const {title , description} = body; 


      if(!userId || !Types.ObjectId.isValid(userId) ) { 
        return new NextResponse("user Id not found", {status: 400})
    }
  
    if(!categoryId || !Types.ObjectId.isValid(categoryId) ) { 
        return new NextResponse("category Id not found", {status: 400})
    }

    await connect()

    const user = await User.findById(userId)

   if(!user) {
    return new NextResponse(JSON.stringify({message : "User not found}"}),{status: 400})
    }

    const category = await Category.findOne({_id: categoryId ,user: userId})

   if(!category) {
    return new NextResponse(JSON.stringify({message : "category not found}"}),{status: 400})
    }

    const newBlog = new Blog({
        title,
        description,
        user: new Types.ObjectId(userId),
        category: new Types.ObjectId(categoryId)
     })

    await newBlog.save();

     return new NextResponse(JSON.stringify(newBlog),{ status: 201 })


        
    } catch (error: any) {
        return new NextResponse("Error in creating Blogs" + error.message , {status:500})
    }



}