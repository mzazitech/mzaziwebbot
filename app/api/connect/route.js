import { NextResponse } from "next/server"
import { startConnection } from "../../../bot/connection"

export async function POST(req){

try{

const { owner, number } = await req.json()

const code = await startConnection(number)

return NextResponse.json({
success:true,
code
})

}catch(err){

return NextResponse.json({
success:false,
error:err.message
})

}

}
