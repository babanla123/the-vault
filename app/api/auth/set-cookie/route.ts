import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user } = body

    if (!user || !user.id || !user.walletAddress) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 })
    }

    console.log("Setting auth cookie for user:", user.id)

    const response = NextResponse.json({ success: true })

    response.cookies.set("vault_user", JSON.stringify(user), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false, // Set to true for production (prevents client JS access)
      sameSite: "lax",
    })

    return response
  } catch (error) {
    console.error("Cookie setting error:", error)
    return NextResponse.json({ error: "Failed to set cookie" }, { status: 500 })
  }
}

export async function POST_LOGOUT(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("vault_user")
  return response
}
