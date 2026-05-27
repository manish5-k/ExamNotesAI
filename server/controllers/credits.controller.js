import Stripe from "stripe"
import UserModel from "../models/user.model.js";
import TransactionModel from "../models/transaction.model.js";
import dotenv from "dotenv"
dotenv.config()

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key missing in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const CREDIT_MAP = {
  100: 50,
  200: 120,
  500: 300,
};

export const createCreditsOrder = async (req,res) => {
    try {
        const userId = req.userId
        const {amount} = req.body;

         if (!CREDIT_MAP[amount]) {
      return res.status(400).json({
        message: "Invalid credit plan",
      });
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${CREDIT_MAP[amount]} Credits`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        credits: CREDIT_MAP[amount],
      },
    })

    // Log the transaction as pending
    await TransactionModel.create({
        userId,
        sessionId: session.id,
        amount,
        credits: CREDIT_MAP[amount],
        status: "pending"
    });

    res.status(200).json({ url: session.url });
    } catch (error) {
         console.error("Stripe order error:", error);
         res.status(500).json({ message: "Stripe error" });
    }
}


export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const userId = session.metadata.userId;
      const creditsToAdd = Number(session.metadata.credits);

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.processedSessions && user.processedSessions.includes(sessionId)) {
        return res.status(200).json({ message: "Credits already added", credits: user.credits });
      }

      user.credits += creditsToAdd;
      user.isCreditAvailable = true;
      if (!user.processedSessions) user.processedSessions = [];
      user.processedSessions.push(sessionId);

      await user.save();

      // Update transaction status
      await TransactionModel.findOneAndUpdate(
        { sessionId },
        { status: "completed" }
      );

      return res.status(200).json({
        message: "Payment verified and credits added",
        credits: user.credits,
      });
    } else {
      return res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const transactions = await TransactionModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};


export const stripeWebhook = async (req,res) => {
    const sig = req.headers["stripe-signature"]
    let event;
    try {
        console.log("🔔 Webhook received");
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )   
    } catch (error) {
         console.log("❌ Webhook signature error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    console.log("✅ Event type:", event.type);

  if(event.type === "checkout.session.completed"){
    const session = event.data.object;
    const userId = session.metadata.userId;
    const creditsToAdd = Number(session.metadata.credits);

    if (!userId || !creditsToAdd) {
        console.log("❌ Missing userId or credits in metadata");
    return res.status(400).json({ message: "Invalid metadata" });
  }

  try {
      const user = await UserModel.findByIdAndUpdate(userId , {
        $inc: { credits: creditsToAdd },
          $set: { isCreditAvailable: true },
          $addToSet: { processedSessions: session.id }
      },{new:true})
      
      if (user) {
          // Update transaction status
          await TransactionModel.findOneAndUpdate(
            { sessionId: session.id },
            { status: "completed" }
          );
          console.log(`💰 Successfully added ${creditsToAdd} credits to user ${userId}.`);
      }
  } catch (dbError) {
      console.error("❌ Database update error:", dbError);
  }

  }

   res.json({ received: true });
}