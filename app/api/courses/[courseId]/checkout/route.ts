import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";


export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }>}
){
    try{
        const session = await getServerSession(authOptions);
        const { courseId } = await params;

        if(!session?.user || !session?.user?.id || !session?.user?.email) {
            return new NextResponse("Unauhtorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true,
            }
        });

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: session?.user?.id,
                    courseId: courseId,
                }
            }
        });

        if(purchase){
            return new NextResponse("Already purchased", { status: 400 });
        }

        if(!course){
            return new NextResponse("Not Found", { status: 404 });
        }
       const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
            quantity: 1,
            price_data: {
                currency: "USD",
                product_data: {
                    name: course.title,
                    description: course.description!,
                },
                unit_amount: Math.round(course.price! * 100),
            }
        }
       ];

       let stripeCustomer = await db.stripeCustomer.findUnique({
        where: {
            userId: session?.user?.id,
        },
        select: {
            stripeCustomerId: true,
        }
       });

       if(!stripeCustomer) {
        const customer =await stripe.customers.create({
            email: session?.user?.email,
        });

        stripeCustomer = await db.stripeCustomer.create({
            data: {
                userId: session?.user?.id,
                stripeCustomerId: customer.id,
            }
        })
       }

       const sesson = await stripe.checkout.sessions.create({
        customer: stripeCustomer.stripeCustomerId,
        line_items,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}/?success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}/?canceled=1`,
        metadata: {
            courseId: course.id,
            userId: session?.user?.id,
        }
       });

       return NextResponse.json({ url: sesson.url });


    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}