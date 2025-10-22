import { NextResponse } from "next/server";

interface SubscribeRequest {
  email?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubscribeRequest;
    const email = body.email?.trim();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    console.info(`[subscribe] captured newsletter sign-up for ${email}`);

    return NextResponse.json({
      message:
        "Thanks for subscribing! We'll reach out as soon as new articles go live.",
    });
  } catch (error) {
    console.error("Failed to process subscription", error);
    return NextResponse.json(
      { message: "We couldn't process that subscription. Please try again." },
      { status: 500 }
    );
  }
}
